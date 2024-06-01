import NextAuth from "next-auth/next";
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';



const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password"}
            },
            // async authorize(credentials: any) {
            // async authorize(credentials: any, req: NextApiRequest) {
                // async authorize(credentials: Record<"email" | "password", string>, req: NextApiRequest) {

            async authorize(credentials: any, req: NextApiRequest) {

                const { userType } = req.body

                try {
                    console.log("Received Credentials: ", credentials);

                    const endpoint = userType === 'customer' ? 'logincust' : 'loginseller';


                    console.log("This is the Fucking endpoint: ", endpoint)



                    const res = await fetch(`http://localhost:4000/api/v1/${endpoint}`, {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" }
                    });

                    const data = await res.json();
                    console.log("API response data: ", data);
                    

                    if(data.success && data.token) {
                        const user = data.data;
                        const token = data.token;
                        return { token, ...user };
                    } else {
                        console.error("Login failed: ", data);
                        return null;
                    }
                }
                catch(error) {
                    console.log("Error: ", error)
                }
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/logingeneral'
    },

    callbacks: {
        jwt: ({ token, user }) => {
            console.log("JWT Callback - token: ", token, "user:", user);
            if(user) {
                token.userId = user.id;
                token.accessToken = user.token;
            }
            return token;
        },
        session: ({ session, token }) => {
            console.log("Session Callback - session: ", session, "token:", token);
            if (session && session.user) {
                session.user.id = token.userId;
                session.user.accessToken = token.accessToken; // Assign accessToken from token
            }
            return session;
        },
    }
});

export const GET = handler;
export const POST = handler;