import HomeMain from "@components/home/HomeMain";
import { connectDB } from "@util/database";

export default function Home() {
  connectDB();
  return <HomeMain />;
}
