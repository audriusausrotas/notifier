import Image from "next/image";

export default function AuthBanner({ login }) {
  return (
    <div
      className={`auth-banner ${
        login ? "auth-banner__bg--login" : "auth-banner__bg--register"
      }`}
    >
      <div
        className={`auth-banner__logo ${
          login ? "auth-banner__logo--pos1" : "auth-banner__logo--pos2"
        }`}
      >
        <Image src="/logo/logo-full.svg" alt="logo" width={160} height={31} />
      </div>

      <div
        className={`auth-banner__header ${
          login ? "auth-banner__header--pos1" : "auth-banner__header--pos2"
        }`}
      >
        <h2 className="auth-banner__header--text ">
          {login
            ? "Get everything done with Notifier!"
            : "Embrace a lifestyle of productivity."}
        </h2>
      </div>

      <div
        className={`auth-banner__text ${
          login ? "auth-banner__text--pos1" : "auth-banner__text--pos2"
        }`}
      >
        <p className="auth-banner__text--text">
          {login
            ? "The personal manager app that helps you remember everything + get more done!"
            : "Create your account for  free to get started."}
        </p>
      </div>
      {login && (
        <Image
          src="/images/cloud.png"
          alt="test"
          width={48}
          height={104}
          className="auth-banner__cloud"
        />
      )}
    </div>
  );
}
