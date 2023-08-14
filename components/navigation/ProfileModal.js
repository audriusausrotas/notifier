import Image from "next/image";
import Link from "next/link";

export default function ProfileModal({ signOutHandler, user }) {
  return (
    <div className="top-bar__modal">
      <div className="top-bar__modal--user top-bar__modal--element">
        <Image src={user.avatar} alt="users avatar" width={42} height={42} />
        <div>
          <h2>
            {user?.firstName} {user?.lastName}
          </h2>
          <h3>{user.email}</h3>
        </div>
      </div>
      <Link href="/settings" className=" top-bar__modal--element">
        Account Settings
      </Link>
      <div onClick={signOutHandler} className=" top-bar__modal--element">
        Sign Out
      </div>
    </div>
  );
}
