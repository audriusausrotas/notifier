import { connectDB } from "@util/database";
import { NextResponse } from "next/server";
import userShema from "@schemas/userSchema";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, pass } = await req.json();

  await connectDB();

  const userExists = await userShema.findOne({
    email: email,
    provider: "credentials",
  });

  if (userExists)
    return NextResponse.json({ message: "Account already exist", ok: false });

  const user = new userShema({
    email,
    password: await bcrypt.hash(pass, +process.env.SALT),
  });

  await user.save();

  return NextResponse.json(
    { message: "Account Created", ok: true },
    { status: 200 }
  );
}
