// app/api/send-whatsapp-message/route.js

import { NextResponse, NextRequest } from 'next/server';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  const { to } = await request.json();

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const msg = await client.messages.create({
      contentSid: 'HX20320c1c458e59ab7e3b47dc3b3b8e5b',
      from: 'MG8ce6f6601b392a8acf5d1ec94f744ea3',
      to: `whatsapp:+55${to}`,
    });
    return NextResponse.json({ success: true, message: msg });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
