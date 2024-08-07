import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/lib/sendEmail";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { to, subject, text } = req.body;

    const result = await sendEmail({ to, subject, text });

    if (result.success) {
      res.status(200).json({ message: "Email sent successfully!" });
    } else {
      res.status(500).json({ message: result.error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
