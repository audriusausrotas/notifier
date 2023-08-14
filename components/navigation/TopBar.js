"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { userActions } from "@states/user";
import ProfileModal from "./ProfileModal";

export default function TopBar({ user }) {
  const [value, setValue] = useState("");
  const [modal, setModal] = useState(false);

  function signOutHandler() {
    signOut({ redirect: true });
  }

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.email) dispatch(userActions.addUser(user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="top-bar">
      <div className="top-bar__search">
        <Image
          src="/icons/search.svg"
          alt="image of a search icon"
          width={20}
          height={20}
        />
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
          className="top-bar__input"
        />
      </div>
      <div className="top-bar__right">
        <Image
          src="/icons/bell.svg"
          alt="image of a notification bell"
          width={24}
          height={24}
        />
        <div
          className="top-bar__user"
          onClick={() => {
            setModal((prev) => !prev);
          }}
        >
          <h2>
            {user?.firstName} {user?.lastName}
          </h2>

          {user?.avatar && (
            <Image
              src={user.avatar}
              alt="users avatar"
              width={24}
              height={24}
            />
          )}

          {modal && (
            <ProfileModal signOutHandler={signOutHandler} user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
