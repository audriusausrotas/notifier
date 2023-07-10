import { mongoose, model, models } from "mongoose";

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  code: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  passed: {
    type: Boolean,
    required: false,
    default: false,
  },
  attempts: {
    type: Number,
    required: false,
    default: 4,
  },
  delay: {
    type: String,
    required: false,
    default: null,
  },
});

const resetShema = models.reset || model("reset", schema);

export default resetShema;
