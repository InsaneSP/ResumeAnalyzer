import { FaUpload, FaFilePdf } from "react-icons/fa";
import { useRef } from "react";

const UploadSection = ({ onFileUpload }) => {
  // Create a ref to the input element
  const fileInputRef = useRef(null);

  const handleChange = (e) => onFileUpload(e.target.files[0]);

  const handleButtonClick = () => {
    // Trigger the file input click using the ref
    fileInputRef.current.click();
  };

  return (
    <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center">
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

      {/* Hidden file input, now using the ref */}
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
        ref={fileInputRef}  // Attach the ref to the input
      />

      {/* Button now triggers the file input through ref */}
      <button
        onClick={handleButtonClick}  // Trigger file input on button click
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
