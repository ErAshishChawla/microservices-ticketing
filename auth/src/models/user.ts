/*
This file defines the user model and its schema.

Steps:
1. Create an interface for the user attributes i.e. the properties needed to create a user.
2. Create an interface for the user document i.e. the properties that a user document has.
3. Create an interface for the user model i.e. the properties that a user model has.
4. Define the user schema.
5. Add a static method to the user schema to create a new user.
6. Create the user model.
7. Export the user model.
*/

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const { Types } = Schema;

// An interface that describes the properties to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Document has
// Extra properties createdAt and updatedAt are added by mongoose, id is by default
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}

// Define the user schema
const userSchema = new Schema(
  {
    email: {
      // This type is specific to mongoose and has no relation to typescript
      type: Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Types.String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc: UserDoc, ret) {
        ret.id = ret._id;
        ret.createdAt = doc.createdAt;
        ret.updatedAt = doc.updatedAt;
        delete ret.password;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

userSchema.pre("save", async function (done) {
  // We want to hash the password only if it is modified. When we create a new user and save it to the database, the password is hashed as it is considered modified.
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.get("password"), 10);
    this.set("password", hashedPassword);
  }
  done();
});

// Adding a static method to the user schema.
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Adding a static method to compare the password
userSchema.statics.comparePassword = (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
