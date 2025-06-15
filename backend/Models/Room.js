import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre de la salle est requis"],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      length: 8,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxMembers: {
      type: Number,
      default: 5,
      max: 5,
    },
    lastMessage: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Generate unique 8-character code
roomSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  next();
});

export default model("Room", roomSchema);
