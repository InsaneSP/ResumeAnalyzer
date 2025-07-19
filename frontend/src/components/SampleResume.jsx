import { FaFileAlt } from "react-icons/fa";

const SampleResumeSection = () => {
  const sampleTypes = [
    "Software Engineer Sample",
    "Marketing Manager Sample",
    "Data Scientist Sample",
  ];

  return (
    <div className="bg-yellow-50 border border-yellow-300 mt-8 p-6 rounded-xl text-center shadow-sm">
      <div className="flex justify-center items-center mb-3 text-yellow-700 font-semibold text-lg">
        <FaFileAlt className="mr-2" />
        Need a Sample Resume?
      </div>
      <p className="text-sm text-yellow-700 mb-4">
        Don't have a resume ready? Download sample resumes to test the analyzer
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {sampleTypes.map((sample, i) => (
          <button
            key={i}
            className="border border-yellow-400 text-yellow-800 font-medium px-4 py-2 rounded-md hover:bg-yellow-100 transition"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleResumeSection;
