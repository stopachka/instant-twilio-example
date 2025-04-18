import schema from "@/instant.schema";
import { init } from "@instantdb/react";

const clientDB = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema,
});

export default clientDB;
