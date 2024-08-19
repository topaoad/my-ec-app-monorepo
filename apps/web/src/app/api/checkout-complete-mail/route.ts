import { NextResponse } from "next/server";
import { Resend } from "resend";
import PurchaseConfirmation from "../../../../../../packages/transactional/emails/PurchaseConfirmation";
import { render } from "@react-email/render";
import React from "react";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, cart, totalAmount } = await req.json();
    const emailHtml = render(React.createElement(PurchaseConfirmation, {
      email,
      cart,
      totalAmount,
    }));

    const data = await resend.emails.send({
      from: "とっぷショップ <noreply@tktoplog.com>",
      to: email,
      subject: "購入完了のお知らせ",
      html: emailHtml,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}