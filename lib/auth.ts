import type { NextAuthOptions, LoggerInstance } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z
  .object({
    email: z
      .string()
      .email()
      .transform((v) => v.trim().toLowerCase()),
    password: z
      .string()
      .min(6)
      .transform((v) => v.trim()),
  })
  .passthrough();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  debug: false,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(raw) {
        console.log("[Credentials][authorize] raw input:", raw);
        try {
          const parsed = credentialsSchema.safeParse(raw);
          if (!parsed.success) {
            const errors = parsed.error.flatten();
            console.log("[Credentials][authorize] validation errors:", errors);
            if (
              errors.fieldErrors.password?.includes(
                "String must contain at least 6 character(s)"
              )
            ) {
              throw new Error("Password must be at least 6 characters long");
            }
            throw new Error("Invalid input data");
          }
          const { email: normalizedEmail, password } = parsed.data as {
            email: string;
            password: string;
          };
          const action =
            typeof (raw as any)?.action === "string"
              ? ((raw as any).action as string)
              : "signin";
          const name =
            typeof (raw as any)?.name === "string"
              ? ((raw as any).name as string)
              : undefined;
          console.log(
            "[Credentials][authorize] normalizedEmail:",
            normalizedEmail,
            "action:",
            action,
            "name:",
            name
          );
          let existing = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });
          console.log("[Credentials][authorize] existing user:", existing);

          if (action === "signup") {
            if (existing)
              throw new Error("User already exists with this email");
            const hashed = await hash(password, 10);
            const user = await prisma.user.create({
              data: {
                email: normalizedEmail,
                name: name || normalizedEmail.split("@")[0],
                passwordHash: hashed,
              },
            });
            console.log("[Credentials][authorize] user created:", user);
            return { id: user.id, email: user.email, name: user.name } as any;
          }

          if (!existing || !existing.passwordHash) {
            console.log(
              "[Credentials][authorize] No account found or missing passwordHash"
            );
            throw new Error("No account found with this email");
          }
          const ok = await compare(password, existing.passwordHash);
          console.log("[Credentials][authorize] password match:", ok);
          if (!ok) {
            throw new Error("Incorrect password");
          }
          return {
            id: existing.id,
            email: existing.email,
            name: existing.name,
          } as any;
        } catch (e: any) {
          console.log("[Credentials][authorize] error:", e);
          throw new Error(e.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      console.log(
        "[NextAuth][session callback] session:",
        session,
        "user:",
        user,
        "token:",
        token
      );
      if (session.user && token) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
      }
      console.log("[NextAuth][session callback] returning session:", session);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log(
        "[NextAuth][jwt callback] token:",
        token,
        "user:",
        user,
        "account:",
        account,
        "profile:",
        profile,
        "isNewUser:",
        isNewUser
      );
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      console.log("[NextAuth][jwt callback] returning token:", token);
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log(
        "[NextAuth][signIn callback] user:",
        user,
        "account:",
        account,
        "profile:",
        profile,
        "email:",
        email,
        "credentials:",
        credentials
      );
      return true;
    },
  },
};
