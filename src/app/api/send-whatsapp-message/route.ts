// app/api/send-whatsapp-message/route.js

import { NextResponse, NextRequest } from 'next/server';
import twilio from 'twilio';
import { OCURRENCE_NOTIFY_TEMPLATE, TWILIO_SENDER } from '../../../../infos';

export async function POST(request: NextRequest) {
  const { to, teacherName, studentName, body } = await request.json();

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const msg = await client.messages.create({
      contentVariables: JSON.stringify({
        1: teacherName,
        2: studentName,
        3: body,
      }),
      contentSid: OCURRENCE_NOTIFY_TEMPLATE,
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
