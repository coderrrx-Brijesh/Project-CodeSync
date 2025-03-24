import NextAuth, { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import GithubProvider from "next-auth/providers/github"

export const AuthOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
          }),
        CredentialsProvider({
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any> {
                try{
                    await connectDB();
                    if(!credentials?.email || !credentials?.password){
                        throw new Error("Invalid credentials");
                    }
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("No user found");
                    }
                    if(!user.isVerified){
                        throw new Error("User is not verified");
                    }
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    return user;
                }catch(error){
                    console.log(error)
                    return null
                }
            }
        })

    ],
    pages:{
        signIn: "/signin",

    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.email = user.email;
                token.isVerified = user.isVerified;
                token.isAdmin = user.isAdmin;
                token.forgotPasswordToken = user.forgotPasswordToken;
                token.forgotPasswordTokenExpiry = user.forgotPasswordTokenExpiry;
                token.verifyToken = user.verifyToken;
                token.verifyTokenExpiry = user.verifyTokenExpiry;   
            }
            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.email = token.email;
                session.user.isVerified = token.isVerified;
                session.user.isAdmin = token.isAdmin;
                session.user.forgotPasswordToken = token.forgotPasswordToken;
                session.user.forgotPasswordTokenExpiry = token.forgotPasswordTokenExpiry;
                session.user.verifyToken = token.verifyToken;
            }
            return session;
        },
    },
}

