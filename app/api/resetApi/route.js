import { connectDB } from "@util/database";
import { NextResponse } from "next/server";
import userShema from "@schemas/userSchema";
import resetSchema from "@schemas/resetSchema";
import bcrypt from "bcrypt";
import sendEmail from "@util/sendEmail";
import generateCode from "@util/generateCode";

///////////////////////////////////////////////////////////

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
  const delayTime = new Date(resetExists?.delay);

  if (resetExists?.delay) {
    if (currentDate > delayTime) {
      resetExists.delay = null;
      await resetExists.save();
    } else {
      const ms = delayTime - currentDate;
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);

      return NextResponse.json({
        message: `You can try again in ${minutes}:${seconds} `,
        ok: false,
      });
    }
  }

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

//////////////////////////////////////////////////////////////

export async function PUT(req) {
  const { userCode, email } = await req.json();

  if (!email) return NextResponse.json({ message: "wrong email", ok: false });

  const resetExists = await resetSchema.findOne({ email });

  if (!resetExists)
    return NextResponse.json({ message: "Something went wrong", ok: false });

  if (!resetExists.code)
    return NextResponse.json({
      message: "Please restart verification process",
      ok: false,
    });

  const currentCode = resetExists.code.toLowerCase();
  const endTime = new Date(resetExists.time);
  const delayTime = new Date(resetExists.delay);
  const currentDate = new Date();

  if (currentDate > endTime) {
    await resetSchema.deleteOne({ email });
    return NextResponse.json({ message: "Time has expired", ok: false });
  }
  //check if there are no temporal ban
  if (resetExists.delay) {
    if (currentDate > delayTime) {
      resetExists.delay = null;
      await resetExists.save();
    } else {
      const ms = delayTime - currentDate;
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return NextResponse.json({
        message: `You can try again in ${minutes}:${seconds}`,
        ok: false,
      });
    }
  }

  if (userCode.toLowerCase() !== currentCode) {
    if (resetExists.attempts > 1) {
      // check if there are more attempts
      resetExists.attempts = resetExists.attempts - 1;
      await resetExists.save();
      return NextResponse.json({
        message: `Wrong code. You have ${resetExists.attempts} attempt${
          resetExists.attempts === 1 ? "" : "s"
        } left`,
        ok: false,
      });
    } else {
      //is there are no more attempts, adds temporal ban
      const endTime = new Date(currentDate.getTime() + 5 * 60000);
      resetExists.delay = endTime;
      resetExists.attempts = 4;
      await resetExists.save();

      return NextResponse.json({
        message: `wrong code. You can try again in 5 minutes`,
        ok: false,
      });
    }
  }

  resetExists.passed = true;
  await resetExists.save();

  return NextResponse.json({ message: "code confirmed", ok: true });
}

////////////////////////////////////////////////////////

export async function PATCH(req) {
  const { pass, email } = await req.json();

  if (!pass) return NextResponse.json({ message: "Wrong password", ok: false });

  if (!email)
    return NextResponse.json({ message: "Error. Try again later", ok: false });

  const resetExists = await resetSchema.findOne({ email });

  if (!resetExists || !resetExists.passed)
    return NextResponse.json({ message: "Error. Try again later", ok: false });

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
    return NextResponse.json({ message: "Error. Try again later", ok: false });

  await resetSchema.deleteOne({ email });

  return NextResponse.json(
    { message: "Password changed", ok: true },
    { status: 200 }
  );
}
