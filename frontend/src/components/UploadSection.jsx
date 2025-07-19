import { FaUpload, FaFilePdf } from "react-icons/fa";
import { useRef, useState } from "react";

const UploadSection = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        isDragging ? "border-blue-700 bg-blue-50" : "border-blue-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-5 rounded-full text-white text-4xl shadow-lg">
          <FaUpload />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Upload Your Resume
      </h2>
      <p className="text-gray-600 mb-6">
        Drag and drop your PDF resume here, or click to browse
      </p>

      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
        ref={fileInputRef}
      />

      <button
        onClick={handleButtonClick}
        className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 rounded-md text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition-colors w-56 mx-auto flex items-center justify-center gap-2"
      >
        <FaFilePdf className="text-lg" />
        Choose PDF File
      </button>

      <p className="text-xs mt-3 text-gray-400">
        Supported format: PDF · Maximum size: 10MB
      </p>
    </div>
  );
};

export default UploadSection;
