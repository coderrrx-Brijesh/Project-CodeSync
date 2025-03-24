import 'next-auth'

declare module 'next-auth' {
    interface User {
            _id?:string;
            firstName?:string;
            lastName?:string;
            email?:string;
            isVerified?:boolean;
            isAdmin?:boolean;
            forgotPasswordToken?:string;
            forgotPasswordTokenExpiry?:Date;
            verifyToken?:string;
            verifyTokenExpiry?:Date;
    }
    interface Session {
        user: {
            _id?:string;
            firstName?:string;
            lastName?:string;
            email?:string;
            isVerified?:boolean;
            isAdmin?:boolean;
            forgotPasswordToken?:string;
            forgotPasswordTokenExpiry?:Date;
            verifyToken?:string;
            verifyTokenExpiry?:Date;
        }&DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?:string;
        firstName?:string;
        lastName?:string;
        email?:string;
        isVerified?:boolean;
        isAdmin?:boolean;
        forgotPasswordToken?:string;
        forgotPasswordTokenExpiry?:Date;
        verifyToken?:string;
        verifyTokenExpiry?:Date;
    }
}
