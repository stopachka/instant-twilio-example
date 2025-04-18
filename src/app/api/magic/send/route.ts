import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/twilio";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phoneNumber = body.phoneNumber;
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Missing phoneNumber" },
        { status: 400 }
      );
    }
    const res = await verify.verifications.create({
      to: phoneNumber,
      channel: "sms",
    });
    if (res.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Failed to send verification code" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending magic code:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
