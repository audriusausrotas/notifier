"use client";

import Image from "next/image";
import { useState } from "react";
import NavLink from "./NavLink";

export default function Nav() {
  const [open, setOpen] = useState(true);


  return (
    <nav className={`nav ${open ? "" : "nav__container--min"}`}>
      <div className="nav__logo">
        <div className="nav__logo--logo">
          <Image src="/logo/logo-icon.svg" alt="Logo" width={22} height={22} />
          {open && (
            <Image
              src="/logo/logo-text.svg"
              alt="Logo"
              width={110}
              height={22}
            />
          )}
        </div>
        <Image
          src={open ? "/icons/arrow.svg" : "/icons/arrow-reverse.svg"}
          alt="arrow for minimize"
          width={20}
          height={35}
          className="nav__arrow"
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        />
      </div>
      <div className="nav__links">
        <NavLink
          href="/dashboard"
          icon="/icons/icon1.svg"
          name="dashboard"
          open={open}
        />
        <NavLink
          href="/notes"
          icon="/icons/icon2.svg"
          name="notes"
          open={open}
        />
        <NavLink
          href="/todo"
          icon="/icons/icon3.svg"
          name="tasks"
          open={open}
        />
        <NavLink
          href="/expense"
          icon="/icons/icon4.svg"
          name="expense tracker"
          open={open}
        />
        <NavLink
          href="/password"
          icon="/icons/icon5.svg"
          name="password manager"
          open={open}
        />
        <NavLink
          href="/downloader"
          icon="/icons/icon6.svg"
          name="youtube downlaoder"
          open={open}
        />
        <NavLink
          href="/converter"
          icon="/icons/icon8.svg"
          name="unit converter"
          open={open}
        />
        <NavLink
          href="/calculator"
          icon="/icons/icon7.svg"
          name="calculator"
          open={open}
        />
      </div>
      <NavLink
        href="/settings"
        icon="/icons/icon9.svg"
        name="settings"
        open={open}
      />
    </nav>
  );
}
