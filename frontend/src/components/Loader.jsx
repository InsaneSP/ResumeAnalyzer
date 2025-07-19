import { useState, useEffect } from "react";

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing analysis...");

  useEffect(() => {
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (progress < 20) {
        setProgress(20);
        setStatusText("Starting analysis...");
      } else if (progress < 40) {
        setProgress(40);
        setStatusText("Analyzing data...");
      } else if (progress < 60) {
        setProgress(60);
        setStatusText("Processing insights...");
      } else if (progress < 80) {
        setProgress(80);
        setStatusText("Finalizing results...");
      } else if (progress < 95) {
        setProgress(95);
        setStatusText("Almost there...");
      } else {
        clearInterval(progressInterval);
        setStatusText("Analysis complete!");
      }
    }, 1000); // Progress updates every second

    return () => clearInterval(progressInterval); // Cleanup interval on component unmount
  }, [progress]);

  return (
    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8">
      <div className="flex justify-center mb-4">
        <div className="bg-blue-500 text-white p-4 rounded-full text-3xl">⚡</div>
      </div>
      <h2 className="text-xl font-semibold">{statusText}</h2>
      <p className="text-blue-600 mb-4">{statusText}</p>
      <div className="w-full bg-gray-200 h-2 rounded mb-2">
        <div className="bg-black h-2 rounded" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-gray-500 text-sm mb-2">{progress}% Complete</p>
      <p className="text-xs text-blue-400">This usually takes 30–60 seconds</p>
    </div>
  );
};

export default Loader;
