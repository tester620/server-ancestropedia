import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    marriedStatus: {
      type: String,
      enum: ["married", "divorced", "unmarried"],
    },
    spouseName: {
      type: String,
    },
    marriageTimeline: {
      type: {
        start: Date,
        end: Date,
      },
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
      default:
        process.env.NEXT_PUBLIC_DEFAULT_IMAGE,
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.profilePicture) {
    if (this.gender === "male") {
      this.profilePicture =
        process.env.NEXT_PUBLIC_DEFAULT_IMAGE;
    } else if (this.gender === "female") {
      this.profilePicture =
        process.env.NEXT_PUBLIC_DEFAULT_IMAGE;
    }
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
      this.invalidate("marriageTimeline", "Marriage timeline is required if divorced.");
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
