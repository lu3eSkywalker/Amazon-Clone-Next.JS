// types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    accessToken: string; // Add the accessToken property
    token?: string; // Add the token property if it's present in your User object
  }
}
