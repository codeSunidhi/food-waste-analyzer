import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [foodItems, setFoodItems] = useState("");
  const [wastedItems, setWastedItems] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: foodItems.split(","),
          wasted_items: wastedItems.split(","),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-6 overflow-hidden">

      {/* Floating circles */}
      <div className="absolute w-72 h-72 bg-yellow-300 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl p-[2px] rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 shadow-2xl"
      >

        {/* Glass Card */}
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8">

          <h1 className="text-4xl font-extrabold text-center text-white mb-6">
            🌈 Food Waste AI
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              value={foodItems}
              onChange={(e) => setFoodItems(e.target.value)}
              placeholder="🍎 Items (milk, bread...)"
              className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white border border-white/40 focus:ring-2 focus:ring-yellow-300 outline-none"
            />

            <input
              value={wastedItems}
              onChange={(e) => setWastedItems(e.target.value)}
              placeholder="🗑️ Wasted Items"
              className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white border border-white/40 focus:ring-2 focus:ring-red-300 outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-red-500 text-white font-bold shadow-lg"
            >
              {loading ? "Analyzing..." : "Analyze 🚀"}
            </motion.button>

          </form>

          {/* Loading */}
          {loading && (
            <motion.div
              className="mt-6 text-center text-white text-lg"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ⚡ AI is thinking...
            </motion.div>
          )}

          {/* Results */}
          {result && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 p-5 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 text-white space-y-3"
            >
              <h2 className="text-xl font-bold">📊 Results</h2>

              <p>🔥 Waste: <b>{result.waste_percent}%</b></p>
              <p>📌 Category: {result.category}</p>

              {/* Progress Bar */}
              <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 bg-gradient-to-r from-green-400 to-red-500"
                  style={{ width: `${result.waste_percent}%` }}
                ></div>
              </div>

              <p>🧠 {result.analysis}</p>
              <p>💡 {result.suggestions}</p>
              <p>🌍 Score: {result.score}</p>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

export default App;