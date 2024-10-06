// app/api/send-whatsapp-message/route.js

import { NextResponse, NextRequest } from 'next/server';
import twilio from 'twilio';
import { PENDING_PAYMENT_TEMPLATE, TWILIO_SENDER } from '../../../../infos';

export async function POST(request: NextRequest) {
  const { to, responsibleName, studentName, description } = await request.json();

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const msg = await client.messages.create({
      contentVariables: JSON.stringify({
        1: responsibleName,
        2: studentName,
        3: description,
      }),
      contentSid: PENDING_PAYMENT_TEMPLATE,
      from: TWILIO_SENDER,
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
