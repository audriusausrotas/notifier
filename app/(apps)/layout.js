import Nav from "@components/navigation/Nav";
import TopBar from "@components/navigation/TopBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@util/authOptions";

export default async function layout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="apps-layout">
      <Nav />
      <div className="apps-layout__main">
        <TopBar user={session.user} />
        <main>{children}</main>
      </div>
    </div>
  );
}
