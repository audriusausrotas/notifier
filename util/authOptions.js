import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@util/database";
import bcrypt from "bcrypt";
import { verifications } from "@util/verifications";
import userShema from "@schemas/userSchema";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Sign In",
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const response = verifications({
          email: credentials.email,
          pass: credentials.password,
        });

        if (!response.ok) {
          throw new Error(response.message);
        }

        connectDB();

        const user = await userShema.findOne({
          email: credentials.email,
          provider: "credentials",
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Wrong password");
        }

        if (credentials.rememberMe !== user.rememberMe) {
          await userShema.findOneAndUpdate(
            {
              email: credentials.email,
              provider: "credentials",
            },
            { $set: { rememberMe: credentials.rememberMe } }
          );
          user.rememberMe = credentials.rememberMe;
        }

        user.password = "";

        return user;
      },
    }),
  ],

  pages: {
    signIn: "/",
    signUp: "/",
  },

  callbacks: {
    async signIn({ user, profile }) {
      if (profile) {
        await connectDB();

        const userExist = await userShema.findOne({
          email: user.email,
          provider: "google",
        });

        if (!userExist) {
          const name = user.name.split(" ");
          const firstName =
            name.length === 1 ? name[0] : name.slice(0, -1).join(" ");
          const lastName = name.length === 1 ? "" : name.slice(-1)[0];

          const newUser = new userShema({
            email: user.email,
            firstName,
            lastName,
            avatar: user.image,
            provider: "google",
          });

          await newUser.save();

          return true;
        }
      }

      return true;
    },

    async session({ session }) {
      connectDB();

      const userData = await userShema.findOne({
        email: session.user.email,
        provider: session.user.name ? "google" : "credentials",
      });

      session.user.id = userData._id.toString();
      session.user.firstName = userData.firstName;
      session.user.lastName = userData.lastName;
      session.user.provider = userData.provider;
      session.user.avatar = userData.avatar;
      delete session.user.image;
      delete session.user.name;

      return session;
    },
  },
};
