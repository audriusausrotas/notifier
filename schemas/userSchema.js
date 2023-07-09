import { mongoose, model, models } from "mongoose";

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
    default: "",
  },
  firstName: {
    type: String,
    required: false,
    default: "",
  },
  lastName: {
    type: String,
    required: false,
    default: "",
  },
  provider: {
    type: String,
    required: false,
    default: "credentials",
  },
  rememberMe: {
    type: Boolean,
    required: false,
    default: true,
  },
  avatar: {
    type: String,
    required: false,
    default:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  },
});

const userShema = models.user || model("user", schema);

export default userShema;
