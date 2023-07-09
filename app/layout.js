import { Poppins } from "next/font/google";
import "@styles/main.scss";
import Providers from "@util/Providers";

const poppins = Poppins({ weight: ["400", "500", "800"], subsets: ["latin"] });

export const metadata = {
  title: "Notifier - get everything done with Notifier",
  description:
    "The personal manager app that helps you remember anything + get done more!",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <div className="root-layout">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
