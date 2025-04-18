export default function ErrorPane({ error }: { error: { message?: string } }) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-bold text-red-600">
          🤕 Uh oh, we got an error! Here's the message:
        </h1>
        <p className="bg-gray-100 p-4">{error.message || "Unknown error"}</p>
        <p>Some more detail:</p>
        <pre className="bg-gray-100 p-4 text-xs font-mono">
          <code>{JSON.stringify(error, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
