import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    upadtesLeft: {
      type: Number,
      max: 1,
      default: 1,
    },
    lastName: {
      type: String,
      required: true,
    },
    marriedStatus: {
      type: String,
      enum: ["married", "single"],
    },

    verificationToken: {
      type: String,
      default: null,
    },
    fatherName: {
      type: String,
    },
    motherName: {
      type: String,
    },
    grandFatherName: {
      type: String,
    },
    grandMotherName: {
      type: String,
    },
    mGrandFatherName: {
      type: String,
    },
    mGrandMotherName: {
      type: String,
    },
    siblings: {
      type: [String],
    },
    childrenName: {
      type: [String],
    },
    viewsLeft: {
      type: Number,
      default: 20,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    profilePicture: {
      type: String,
      default: process.env.DEFAULT_IMAGE_URL,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    dob: {
      type: Date,
    },
    birthPlace: {
      type: String,
    },
    alive: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.profilePicture) {
    this.profilePicture = process.env.DEFAULT_IMAGE_URL;
  }

  if (this.marriedStatus === "married") {
    if (!this.spouseName) {
      this.invalidate("spouseName", "Spouse name is required if married.");
    }
  } else {
    this.spouseName = undefined;
  }

  if (this.marriedStatus === "divorced") {
    if (!this.marriageTimeline?.start || !this.marriageTimeline?.end) {
      this.invalidate(
        "marriageTimeline",
        "Marriage timeline is required if divorced."
      );
    }
  } else {
    this.marriageTimeline = undefined;
  }

  if (this.marriedStatus !== "married") {
    this.childrenName = [];
  }

  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
