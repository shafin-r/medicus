import "./globals.css";
import { Work_Sans } from "next/font/google";
const workSans = Work_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Medicus",
  description: "created for CSE479",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={workSans.className}>{children}</body>
    </html>
  );
}
