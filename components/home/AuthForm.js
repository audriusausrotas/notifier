"use client";

import { useState } from "react";
import InputElement from "./InputElement";
import ButtonElement from "./ButtonElement";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@components/LoadingSpinner";

export default function AuthForm({ login, setLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function loginHandler(e) {
    e.preventDefault();

    setLoading(true);

    signIn("credentials", {
      email: email,
      password: pass,
      rememberMe: rememberMe,
      redirect: false,
    }).then((data) => {
      setLoading(false);

      if (data && !data.error) {
        router.push("/dashboard");
      } else {
        console.log("Error: ", data);
        showError("Your email or password is wrong");
      }
    });
  }

  function registerHandler(e) {
    e.preventDefault();

    if (pass !== pass2) {
      showError("Passwords should match");
      return;
    }

    setLoading(true);

    fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        pass: pass,
        pass2: pass2,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);

        if (data.ok) {
          clearInputs();
          setLogin("true");
          showError("Registion successful. You can login now");
        } else {
          showError(data.message);
        }
      });
  }

  function loginWithGoogle() {
    signIn("google", { callbackUrl: "/dashboard" });
  }

  function loginToggle() {
    setLogin((prev) => !prev);
  }

  function rememberMeHandler() {
    setRememberMe((prev) => !prev);
  }

  function showError(err) {
    setError(err);
    setTimeout(() => {
      setError("");
    }, 3000);
  }

  function clearInputs() {
    setEmail("");
    setPass("");
    setPass2("");
  }

  return (
    <div
      className="auth-form"
      onSubmit={login ? loginHandler : registerHandler}
    >
      <form className="auth-form__container">
        <h2 className="auth-form__welcome">
          {login ? "hello! welcome back" : "create account"}
        </h2>

        <div className="error">{error}</div>

        <InputElement
          type="text"
          label="email"
          plh="Enter your email address"
          value={email}
          setValue={setEmail}
        />

        <InputElement
          type="password"
          label="password"
          plh="Enter your password"
          value={pass}
          setValue={setPass}
        />

        {!login && (
          <InputElement
            type="password"
            label="confirm password"
            plh="Confirm password"
            value={pass2}
            setValue={setPass2}
          />
        )}

        <div className="auth-form__terms">
          <div className="auth-form__terms--left">
            <input
              type="checkbox"
              required={login ? false : true}
              id="checkbox"
              checked={rememberMe}
              onChange={rememberMeHandler}
            />
            {login ? (
              <label htmlFor="rememberMebox">Remenber Me</label>
            ) : (
              <label>
                I agree to the{" "}
                <Link href="#">terms of services and privacy </Link> statement
              </label>
            )}
          </div>
          {login && (
            <Link href="/reset" className="auth-form__terms--right">
              Forgot Password?
            </Link>
          )}
        </div>

        <ButtonElement type="submit">
          {login ? "Login" : "Create Account"}
        </ButtonElement>

        <div className="auth-form__or">
          <hr />
          <p>or</p>
          <hr />
        </div>

        <ButtonElement type="button" onclick={loginWithGoogle}>
          <Image
            src="/icons/google.svg"
            alt="google icon"
            width={32}
            height={32}
          />
          <p>Login with Google</p>
        </ButtonElement>

        <p className="auth-form__loginHandler">
          {login ? "Don't" : "Already"} have an account?{" "}
          <span onClick={loginToggle}>
            {login ? "Create Account" : "Login"}
          </span>
        </p>
      </form>
      {loading && <LoadingSpinner />}
    </div>
  );
}
