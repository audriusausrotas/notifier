import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("DB already connected");
  } else {
    try {
      await mongoose.connect(process.env.MONGO_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("DB connected");
    } catch (error) {
      console.log(error);
    }
  }
}
