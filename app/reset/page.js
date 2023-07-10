"use client";

import Image from "next/image";
import ButtonElement from "@components/home/ButtonElement";
import InputElement from "@components/home/InputElement";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import LoadingSpinner from "@components/LoadingSpinner";

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
  const [loading, setLoading] = useState(false);

  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  const countdown = useRef(null);
  const errorTimeout = useRef(null);
  const router = useRouter();

  function resetHandler(e) {
    e.preventDefault();

    if (!nr1.includes("@")) {
      showError("Wrong email");
      return;
    }

    setLoading(true);

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
        setLoading(false);

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

    setLoading(true);

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
        setLoading(false);

        if (data.ok) {
          clearInputs();
          setStage(2);
        } else {
          if (data.message.includes("again")) {
            stopTimer();
            clearInputs();
            setStage(0);
            setTimer(300);
          }
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

    setLoading(true);

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
        setLoading(false);

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

    setTimeout(() => {
      clearInputs();
      setStage(0);
    }, 2000);
    router.replace("/");
  }

  function startTimer() {
    stopTimer();
    countdown.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(countdown.current);
  }

  function showError(err) {
    setError(err);
    clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => {
      setError("");
    }, 3000);
  }

  function clearInputs() {
    setNr1("");
    setNr2("");
    setNr3("");
    setNr4("");
  }

  function pasteHandler(e) {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text/plain");
    const symbols = pastedText.split("").slice(0, 4);

    setNr1(symbols[0] || "");
    setNr2(symbols[1] || "");
    setNr3(symbols[2] || "");
    setNr4(symbols[3] || "");
  }

  function deleteHandler(e) {
    if (e.key === "Backspace") {
      if (nr4 !== "") setNr4("");
      else if (nr3 !== "") setNr3("");
      else if (nr2 !== "") setNr2("");
      else if (nr1 !== "") setNr1("");
    }
  }

  useEffect(() => {
    if (timer < 1) {
      setStage(0);
      setTimer(300);
      clearInputs();
      showError("Your code has expired");
    }
  }, [timer]);

  useEffect(() => {
    if (nr1 === "") input1.current.focus();
    else if (nr2 === "") input2.current.focus();
    else if (nr3 === "") input3.current.focus();
    else input4.current.focus();
  }, [nr1, nr2, nr3, nr4]);

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
                rf={input1}
                handlePaste={pasteHandler}
                deleteHandler={deleteHandler}
              />

              {stage !== 0 && (
                <InputElement
                  type={stage === 2 ? "password" : "text"}
                  label={stage === 2 ? "Confirm password" : ""}
                  plh={stage === 2 ? "Re-type new password" : ""}
                  value={nr2}
                  setValue={setNr2}
                  length={stage === 1 ? "1" : ""}
                  rf={input2}
                  handlePaste={pasteHandler}
                  deleteHandler={deleteHandler}
                />
              )}

              {stage === 1 && (
                <>
                  <InputElement
                    type="text"
                    value={nr3}
                    setValue={setNr3}
                    length="1"
                    rf={input3}
                    handlePaste={pasteHandler}
                    deleteHandler={deleteHandler}
                  />
                  <InputElement
                    type="text"
                    value={nr4}
                    setValue={setNr4}
                    length="1"
                    rf={input4}
                    handlePaste={pasteHandler}
                    deleteHandler={deleteHandler}
                  />
                </>
              )}
            </div>
          )}
          {stage === 1 && (
            <div className="error">
              {`Your code will expire in: ${Math.floor(timer / 60)}:${(
                timer % 60
              )
                .toString()
                .padStart(2, "0")}`}
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
      {loading && <LoadingSpinner />}
    </form>
  );
}
