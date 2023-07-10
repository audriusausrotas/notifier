"use client";

import { useState } from "react";
import InputElement from "./InputElement";
import ButtonElement from "./ButtonElement";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthForm({ login, setLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [check, setCheck] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function loginHandler(e) {
    e.preventDefault();

    const signInResponse = await signIn("credentials", {
      email: email,
      password: pass,
      rememberMe: check,
      redirect: false,
    });

    if (signInResponse && !signInResponse.error) {
      router.push("/dashboard");
    } else {
      console.log("Error: ", signInResponse);
      showError("Your email or password is wrong");
    }
  }

  function registerHandler(e) {
    e.preventDefault();

    if (pass !== pass2) {
      showError("Passwords should match");
      return;
    }

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
        if (data.ok) {
          clearInputs();
          setLogin("true");
          setError("Registion successful. You can login now");
        }
      });
  }

  async function loginWithGoogle() {
    signIn("google", { callbackUrl: "/dashboard" });
  }

  function loginToggle() {
    setLogin((prev) => !prev);
  }

  function checkHandler() {
    setCheck((prev) => !prev);
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
              checked={check}
              onChange={checkHandler}
            />
            {login ? (
              <label htmlFor="checkbox">Remenber Me</label>
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
    </div>
  );
}
