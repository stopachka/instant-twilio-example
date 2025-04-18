"use client";

import React, { useState } from "react";
import { jsonFetch } from "../lib/fetchJSON";
import clientDB from "@/clientDB";

export default function LoginPane() {
  const [sentPhone, setSentPhone] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-sm">
        {!sentPhone ? (
          <PhoneStep onSendSMS={setSentPhone} />
        ) : (
          <CodeStep sentPhone={sentPhone} />
        )}
      </div>
    </div>
  );
}

function PhoneStep({
  onSendSMS,
}: {
  onSendSMS: (phoneNumber: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputEl = inputRef.current!;
    const rawPhoneNumber = inputEl.value;

    // Normalize phone number
    const phoneNumber = normalizePhoneNumber(rawPhoneNumber);

    if (!phoneNumber) {
      alert("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    onSendSMS(phoneNumber);
    try {
      await jsonFetch("/api/magic/send", {
        method: "POST",
        body: JSON.stringify({ phoneNumber }),
      });
    } catch (err) {
      console.error("Error sending SMS:", err);
      alert(messageForError(err));
      onSendSMS("");
    }
  };

  return (
    <form
      key="phone"
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4"
    >
      <h2 className="text-xl font-bold">🐧 Welcome to Penguin!</h2>
      <div>
        Add Penguin to your group chat, and he'll help you set up hangs with
        your friends!
      </div>
      <p className="text-gray-700">
        To get started, sign in with your phone number:
      </p>
      <input
        ref={inputRef}
        type="tel"
        className="border border-gray-300 px-3 py-1 w-full"
        placeholder="6507963716"
        required
        autoFocus
      />
      <button
        type="submit"
        className="px-3 py-1 bg-blue-600 text-white font-bold hover:bg-blue-700 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send Code
      </button>
    </form>
  );
}

function CodeStep({ sentPhone }: { sentPhone: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputEl = inputRef.current!;
    const code = inputEl.value;

    try {
      const { token } = await jsonFetch("/api/magic/verify", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: sentPhone,
          code,
        }),
      });
      clientDB.auth.signInWithToken(token);
    } catch (err) {
      console.error("Error verifying code:", err);
      inputEl.value = "";
      alert(messageForError(err));
    }
  };

  return (
    <form
      key="code"
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4"
    >
      <h2 className="text-xl font-bold">Enter your code</h2>
      <p className="text-gray-700">
        We sent a code to <strong>{sentPhone}</strong>. Enter the code you
        received.
      </p>
      <input
        ref={inputRef}
        type="text"
        className="border border-gray-300 px-3 py-1 w-full"
        placeholder="123456..."
        required
        autoFocus
      />
      <button
        type="submit"
        className="px-3 py-1 bg-blue-600 text-white font-bold hover:bg-blue-700 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Verify Code
      </button>
    </form>
  );
}

// ---
// Helpers

function messageForError(err: any) {
  return (
    err?.body?.message ||
    err?.message ||
    "An unknown error occurred. Please ping Stopa."
  );
}

/**
 * Normalizes a phone number to E.164 format (+1XXXXXXXXXX) for Twilio
 * @returns normalized phone number or null if invalid
 */
const normalizePhoneNumber = (phone: string): string | null => {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, "");

  // Check if the number has at least 10 digits
  if (digits.length < 10) {
    return null;
  }

  // If exactly 10 digits, assume US number and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // If 11 digits and starts with 1, assume US number
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  // If already has + prefix, return as is with + added back
  if (phone.startsWith("+")) {
    return `+${digits}`;
  }

  // If number has more than 11 digits, it may be international
  // Just ensure it has a + prefix
  if (digits.length > 11) {
    return `+${digits}`;
  }

  // Default case - can't normalize
  return null;
};
