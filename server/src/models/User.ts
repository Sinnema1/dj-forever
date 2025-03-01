import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";

/**
 * @interface UserDocument
 * Defines the structure of a user document in the database.
 */
export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
  isAdmin: boolean;
}

/**
 * @constant userSchema
 * Defines the structure of the User collection in the database.
 */
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

/**
 * Middleware: Hashes user password before saving to the database.
 */
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

/**
 * @method isCorrectPassword
 * Validates the user's password during login.
 * @param {string} password - The input password.
 * @returns {Promise<boolean>} - True if the password is correct, otherwise false.
 */
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = model<UserDocument>("User", userSchema);
export default User;
