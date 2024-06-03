// app/api/send-whatsapp-message/route.js

import { NextResponse, NextRequest } from 'next/server';
import twilio from 'twilio';

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
      contentSid: 'HX6bf8df52aebd9f6ea796797e12063c1a',
      from: 'MGb4e201177f9d9524366e0cebb1c64256',
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
