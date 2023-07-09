import { connectDB } from "@util/database";
import { NextResponse } from "next/server";
import userShema from "@schemas/userSchema";
import resetSchema from "@schemas/resetSchema";
import bcrypt from "bcrypt";
import sendEmail from "@util/sendEmail";

function generateCode() {
  let code = [];
  for (let i = 0; i < 4; i++) {
    const number = Math.round(Math.random() * 9);
    code.push(number);
  }
  return code;
}

export async function POST(req) {
  const { email } = await req.json();

  await connectDB();

  const userExists = await userShema.findOne({
    email: email,
    provider: "credentials",
  });

  if (!userExists)
    return NextResponse.json({ message: "Account not found", ok: false });

  const resetExists = await resetSchema.findOne({ email });

  const code = generateCode();
  const currentDate = new Date();
  const endTime = new Date(currentDate.getTime() + 5 * 60000);

  const resetObj = new resetSchema({
    code: code.join(""),
    email: email,
    time: endTime,
    passed: false,
  });

  if (resetExists) {
    resetExists.code = code.join("");
    resetExists.time = endTime;
    await resetExists.save();
  } else {
    await resetObj.save();
  }

  const emailSent = await sendEmail(email, code.join(""));

  if (!emailSent.ok)
    return NextResponse.json({
      message: "Can't send email. Please contact support",
      ok: false,
    });

  return NextResponse.json({ message: "code send", ok: true });
}

export async function PUT(req) {
  const { userCode, email } = await req.json();

  if (!email) NextResponse.json({ message: "wrong email", ok: false });

  const resetExists = await resetSchema.findOne({ email });

  if (!resetExists)
    NextResponse.json({ message: "Something went wrong", ok: false });

  const currentCode = resetExists.code;
  const endTime = resetExists.time;
  const currentDate = new Date();

  if (currentDate > endTime) {
    await resetSchema.deleteOne({ email });
    return NextResponse.json({ message: "Time has expired", ok: false });
  }

  if (userCode !== currentCode) {
    return NextResponse.json({ message: "Wrong code", ok: false });
  }

  resetExists.passed = true;
  await resetExists.save();

  return NextResponse.json(
    { message: "code confirmed", ok: true },
    { status: 200 }
  );
}

export async function PATCH(req) {
  const { pass, email } = await req.json();

  if (!pass) NextResponse.json({ message: "Wrong password", ok: false });

  if (!email)
    NextResponse.json({ message: "Error. Try again later", ok: false });

  const resetExists = await resetSchema.findOne({ email });

  if (!resetExists || !resetExists.passed)
    NextResponse.json({ message: "Error. Try again later", ok: false });

  connectDB();

  const user = await userShema.findOneAndUpdate(
    {
      email: email,
      provider: "credentials",
    },
    { password: await bcrypt.hash(pass, +process.env.SALT) },
    { new: true }
  );

  if (!user)
    NextResponse.json({ message: "Error. Try again later", ok: false });

  await resetSchema.deleteOne({ email });

  return NextResponse.json(
    { message: "Password changed", ok: true },
    { status: 200 }
  );
}
