import { FaBullseye, FaStar, FaArrowUpRightDots } from "react-icons/fa6";
import { TbArrowNarrowUp } from "react-icons/tb";

const WhatYouGetSection = () => {
  const features = [
    {
      icon: <FaBullseye className="text-green-600" />,
      title: "Skill Extraction",
      desc: "Comprehensive analysis of technical and soft skills",
      bgColor: "bg-green-100",
    },
    {
      icon: <FaStar className="text-blue-500" />,
      title: "Resume Rating",
      desc: "Professional scoring with detailed feedback",
      bgColor: "bg-blue-100",
    },
    {
      icon: <FaArrowUpRightDots className="text-purple-500" />,
      title: "Improvements",
      desc: "Actionable suggestions to enhance your resume",
      bgColor: "bg-purple-100",
    },
    {
      icon: <TbArrowNarrowUp className="text-orange-400" />,
      title: "Upskilling",
      desc: "Personalized learning recommendations",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="mt-10">
      <div className="bg-blue-50 p-8 rounded-xl shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          What You'll Get from AI Analysis
        </h2>
        <p className="text-gray-600 mb-6">
          Comprehensive insights powered by advanced AI technology
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
          {features.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div
                className={`${item.bgColor} rounded-full p-4 mb-3 inline-flex items-center justify-center`}
              >
                {item.icon}
              </div>
              <h4 className="font-semibold text-gray-800">{item.title}</h4>
              <p className="text-gray-500 text-sm max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatYouGetSection;
