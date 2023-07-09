"use client";

import AuthBanner from "./AuthBanner";
import AuthForm from "./AuthForm";
import { useState } from "react";

export default function HomeMain() {
  const [login, setLogin] = useState(true);

  return (
    <div className="auth">
      <AuthBanner login={login} />
      <AuthForm login={login} setLogin={setLogin} />
    </div>
  );
}
