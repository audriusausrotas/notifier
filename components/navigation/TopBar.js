"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { userActions } from "@states/user";

export default async function TopBar({ user }) {
  const [value, setValue] = useState("");
  const [modal, setModal] = useState(true);

  function signOutHandler() {
    signOut({ redirect: true });
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.addUser(user));
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
        <div className="top-bar__user">
          <h2>
            {user?.firstName} {user?.lastName}
          </h2>

          {user?.avatar && (
            <Image
              src={user.avatar}
              alt="users avatar"
              width={24}
              height={24}
              onClick={() => {
                setModal((prev) => !prev);
              }}
            />
          )}

          {modal && (
            <div className="top-bar__modal">
              <button type="button" onClick={signOutHandler}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
