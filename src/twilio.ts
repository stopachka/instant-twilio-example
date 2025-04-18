import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const accountSecret = process.env.TWILIO_ACCOUNT_SECRET!;
const verifySid = process.env.TWILIO_VERIFY_SID!;

const twilio = Twilio(accountSid, accountSecret);

const verify = twilio.verify.v2.services(verifySid);

export { twilio, verify };
