import { NextResponse } from "next/server";
import { Resend } from "resend";
import MyEmail2 from "../../../../../../packages/transactional/emails/MyEmail2";  // パスは実際の場所に合わせて調整してください
import { render } from "@react-email/render";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { username, recipientEmail } = await req.json();

    const emailComponent = React.createElement(MyEmail2, { username });
    const emailHtml = render(emailComponent);

    const data = await resend.emails.send({
      from: "Your Name <sample@resend.dev>",  // Resendで検証済みのメールアドレスを使用
      to: recipientEmail,
      subject: "Welcome to Our Service",
      html: emailHtml,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}