"use client";

import clientDB from "@/clientDB";
import DashPane from "@/panes/DashPane";
import ErrorPane from "@/panes/ErrorPane";
import LoginPane from "@/panes/LoginPane";

function App() {
  const { isLoading, error, user } = clientDB.useAuth();
  if (isLoading) {
    return null;
  }

  if (error) {
    return <ErrorPane error={error} />;
  }
  if (!user) {
    return <LoginPane />;
  }
  return <DashPane />;
}

export default App;
