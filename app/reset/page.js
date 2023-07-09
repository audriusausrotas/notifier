"use client";

import Image from "next/image";
import ButtonElement from "@components/home/ButtonElement";
import InputElement from "@components/home/InputElement";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TITLES = [
  "forgot password",
  "verification",
  "change password",
  "successfully",
];
const TEXTS = [
  "Enter your email for the verification process, we will send 4 digits code to your email.",
  "Please enter the four-digit code you received in your email. If you haven't received a code, please check your spam folder.",
  "Create a new password at least 6 characters long. A strong password is combination of letter, numbers, and punctuation marks.",
  "Your password has been successfully changed!",
];
const BTN_TEXT = ["reset password", "continue", "save new password", "login"];

export default function Reset() {
  const [nr1, setNr1] = useState("");
  const [nr2, setNr2] = useState("");
  const [nr3, setNr3] = useState("");
  const [nr4, setNr4] = useState("");
  const [stage, setStage] = useState(0);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(300);

  const router = useRouter();

  function resetHandler(e) {
    e.preventDefault();

    fetch("/api/resetApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: nr1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setEmail(nr1);
          clearInputs();
          startTimer();
          setStage(1);
        } else {
          showError(data.message);
        }
      });
  }

  function verificationHandler(e) {
    e.preventDefault();

    if (!nr1 || !nr2 || !nr3 || !nr4) {
      showError("Fill all fields");
      return;
    }

    if (!email) {
      showError("Error. Try again later");
    }

    const code = [nr1, nr2, nr3, nr4];

    fetch("/api/resetApi", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        userCode: code.join(""),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          clearInputs();
          setStage(2);
        } else {
          showError(data.message);
        }
      });
  }

  function changeHandler(e) {
    e.preventDefault();

    if (!email) {
      showError("Error. Try again later");
    }
    if (!nr1 || !nr2 || nr1 !== nr2) {
      showError("Wrong password");
    }

    fetch("/api/resetApi", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        pass: nr1,
        pass2: nr2,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          clearInputs();
          setStage(3);
        } else {
          showError(data.message);
        }
      });
  }

  function successHandler(e) {
    e.preventDefault();
    setEmail("");
    setStage(0);
    router.replace("/");
  }

  function startTimer() {
    setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  function showError(err) {
    setError(err);
    setTimeout(() => {
      setError("");
    }, 3000);
  }

  function clearInputs() {
    setNr1("");
    setNr2("");
    setNr3("");
    setNr4("");
  }

  return (
    <form className="reset">
      <div className="reset__container">
        <Image
          src="/logo/logo-full.svg"
          alt="notifier logo"
          width={160}
          height={32}
        />
        <h2>{TITLES[stage]}</h2>
        <p>{TEXTS[stage]}</p>

        <div className="reset__container--inputs">
          {stage !== 3 && (
            <div className={stage === 1 ? "reset__inputs2" : "reset__inputs"}>
              <InputElement
                type={stage === 2 ? "password" : "text"}
                label={
                  stage === 0 ? "Email" : stage === 2 ? "New password" : ""
                }
                plh={
                  stage === 0
                    ? "Enter your email address"
                    : stage === 2
                    ? "Enter new password"
                    : ""
                }
                length={stage === 1 ? "1" : ""}
                value={nr1}
                setValue={setNr1}
              />

              {stage !== 0 && (
                <InputElement
                  type={stage === 2 ? "password" : "text"}
                  label={stage === 2 ? "Confirm password" : ""}
                  plh={stage === 2 ? "Re-type new password" : ""}
                  value={nr2}
                  setValue={setNr2}
                  length={stage === 1 ? "1" : ""}
                />
              )}

              {stage === 1 && (
                <>
                  <InputElement
                    type="text"
                    value={nr3}
                    setValue={setNr3}
                    length="1"
                  />
                  <InputElement
                    type="text"
                    value={nr4}
                    setValue={setNr4}
                    length="1"
                  />
                </>
              )}
            </div>
          )}
          {stage === 1 && (
            <div className="error">
              {timer > 0
                ? `Your code will expire in: ${Math.floor(timer / 60)}:${(
                    timer % 60
                  )
                    .toString()
                    .padStart(2, "0")}`
                : "The verification code has expired."}
            </div>
          )}

          <div className="error">{error}</div>
        </div>

        <ButtonElement
          type="submit"
          onclick={
            stage === 0
              ? resetHandler
              : stage === 1
              ? verificationHandler
              : stage === 2
              ? changeHandler
              : successHandler
          }
          className="reset__button"
        >
          {BTN_TEXT[stage]}
        </ButtonElement>
      </div>
    </form>
  );
}
