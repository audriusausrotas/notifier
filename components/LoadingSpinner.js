import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="loading">
      <Image
        src="/images/loading.png"
        alt="image of a loading spinner"
        width={200}
        height={200}
        className="loading__spinner"
      />
      <h3 className="loading__text">Wait a moment</h3>
      <h3 className="loading__text">We're creating your account</h3>
    </div>
  );
}
