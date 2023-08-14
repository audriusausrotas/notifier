import Image from "next/image";

export default function SuccessElement({ text }) {
  return (
    <div className="success">
      <div className="success__green"></div>
      <div className="success__element">
        <Image
          src="/icons/success.svg"
          alt="success icon"
          width={19}
          height={19}
        />
        <p>{text}</p>
      </div>
    </div>
  );
}
