import schema from "@/instant.schema";
import { init } from "@instantdb/admin";

const adminDB = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
  schema,
});

export default adminDB;
