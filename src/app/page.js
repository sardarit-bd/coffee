'use client'
import { useState } from "react";
import axios from "axios";
import AiTyping from "../components/AiTyping";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post("https://coffee-server-orcin.vercel.app/api/pairing", { prompt });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Coffee & Pastry AI Pairing
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-4">
        <textarea
          rows="4"
          placeholder="Type your coffee and pastry prompt..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brandColor)]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--brandColor)] text-white rounded-md hover:bg-[var(--brandColorDark)] transition"
        >
          Generate Pairing
        </button>
      </form>

      <div className="mt-6 w-full max-w-xl bg-white p-4 rounded-md shadow-md">
        {loading && <AiTyping text="AII is thinking..." />}
        {!loading && response && (
          response.error ? (
            <p className="text-red-500">{response.error}</p>
          ) : (
            <div>
              <p className="font-semibold mb-2">Coffee: {response.coffee}</p>
              {response.pairing.map((p, idx) => (
                <div key={idx} className="mb-2">
                  <p className="font-medium">{p.pastry}</p>
                  <p className="text-gray-600">{p.reason}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
