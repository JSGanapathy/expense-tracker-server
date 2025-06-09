/*
 *  Document    : User.js
 *  Author      : Ganapathy
 *  Description : Model for User documents in MongoDB.
 */

// Import necessary modules
const mongoose = require("mongoose");
const { v4 } = require("uuid");
const bcrypt = require("bcryptjs");

// Define the User schema
// This schema defines the structure of the User documents in MongoDB
const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// export the User model
module.exports = mongoose.model("User", UserSchema);
