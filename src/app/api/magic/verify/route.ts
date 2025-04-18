import adminDB from "@/adminDB";
import { verify } from "@/twilio";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phoneNumber = body.phoneNumber;
    const code = body.code;
    if (!phoneNumber || !code) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing phoneNumber or code",
          hint: { body: { phoneNumber, code } },
        },
        { status: 400 }
      );
    }

    const verifyRes = await verify.verificationChecks.create({
      to: phoneNumber,
      code: code,
    });

    if (verifyRes.status !== "approved") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid code",
          hint: { verifyStatus: verifyRes.status },
        },
        { status: 401 }
      );
    }

    const token = await adminDB.auth.createToken(
      `${phoneNumber}@auth.penguin.is`
    );
    return NextResponse.json({ success: true, token: token });
  } catch (error: any) {
    console.error("Error verifying magic code:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
