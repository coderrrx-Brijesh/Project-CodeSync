import mongoose, { Schema, model, Document, Model } from "mongoose";

interface myUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
}

const userSchema = new Schema<myUser>(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
      default: undefined,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
      default: undefined,
    },
    verifyToken: {
      type: String,
      default: undefined,
    },
    verifyTokenExpiry: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true }
);

// This is the proper way to handle mongoose models in Next.js
// It prevents the "models.users is undefined" error
const User = mongoose.models.users || mongoose.model<myUser>('users', userSchema);

export default User as Model<myUser>;
