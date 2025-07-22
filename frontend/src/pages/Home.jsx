import { useState } from "react";
import UploadSection from "../components/UploadSection";
import Loader from "../components/Loader";
import AnalysisResult from "../components/AnalysisResult";
import WhatYouGetSection from "../components/WhatYouGetSection";
import SampleResume from "../components/SampleResume";
import ResumeHistory from "./History"; // Import ResumeHistory
import { FaUpload, FaHistory } from "react-icons/fa";

function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "history"

  const handleUpload = async (uploadedFile) => {
  setFile(uploadedFile);
  setLoading(true);

  const formData = new FormData();
  formData.append("file", uploadedFile);

  try {
    const response = await fetch("http://localhost:8000/upload-resume/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");

    const result = await response.json();

    setData({
      filename: result.file_name,
      name: result.name || "",
      email: result.email || "",
      phone: result.phone || "",
      location: "", // You can improve this later
      core_skills: result.core_skills || [],
      soft_skills: result.soft_skills || [],
      score: result.resume_rating || 0,
      summary: result.summary || "",

      experiences: (result.work_experience || []).map((exp) => ({
        title: exp.job_title,
        company: exp.company,
        time: `${exp.start_date} - ${exp.end_date}`,
        description: exp.description,
      })),

      education: (result.education || []).map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.end_date?.split(" ")[1] || "N/A",  // extract year
      })),

      certifications: (result.certifications || []).map((cert) => ({
        name: cert.name || "",
        issuer: cert.issuer || "",
        year: cert.year || "",
      })),

      projects: (result.projects || []).map((proj) => ({
        title: proj.title || "",
        description: proj.description || "",
        tags: typeof proj.tech === "string"
        ? proj.tech.split(",").map((t) => t.trim())
        : Array.isArray(proj.tech)
        ? proj.tech.map((t) => t.toString().trim())
        : [],
      })),

      improvement_areas: result.resume_improvement_suggestions || [],
      upskill_suggestions: result.upskill_suggestions || [],
    });


  } catch (err) {
    console.error(err);
    alert("Something went wrong while uploading resume.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <main className="flex-grow px-4 max-w-7xl mx-auto py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          {/* Tabs */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-t-lg">
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setActiveTab("upload");
                  setFile(null);
                  setData(null);
                }}
                className={`px-4 py-2 font-semibold rounded-t-md flex items-center gap-2 ${
                  activeTab === "upload"
                    ? "bg-white text-blue-600"
                    : "text-white hover:bg-blue-700"
                }`}
              >
                <FaUpload />
                Upload & Analyze
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 ml-2 font-semibold rounded-t-md flex items-center gap-2 ${
                  activeTab === "history"
                    ? "bg-white text-blue-600"
                    : "text-white hover:bg-blue-700"
                }`}
              >
                <FaHistory />
                Resume History
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="py-6 px-6">
            {activeTab === "upload" && (
              <>
                {!file && <UploadSection onFileUpload={handleUpload} />}
                {loading && <Loader />}
                {data && <AnalysisResult data={data} />}
                {!data && (
                  <>
                    <div className="mt-12">
                      <WhatYouGetSection />
                    </div>
                    <div className="mt-12">
                      <SampleResume />
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === "history" && (
              <div className="mt-6">
                <ResumeHistory
                  onView={(fullData) => {
                    const normalized = {
                      filename: fullData.filename,
                      name: fullData.name || "",
                      email: fullData.email || "",
                      phone: fullData.phone || "",
                      location: "",

                      core_skills: fullData.core_skills || [],
                      soft_skills: fullData.soft_skills || [],
                      score: fullData.resume_rating || fullData.score || 0,
                      summary: fullData.summary || "",

                      experiences: (fullData.work_experience || []).map((exp) => ({
                        title: exp.job_title,
                        company: exp.company,
                        time: `${exp.start_date} - ${exp.end_date}`,
                        description: exp.description,
                      })),

                      education: (fullData.education || []).map((edu) => ({
                        degree: edu.degree,
                        institution: edu.institution,
                        year: edu.end_date?.split(" ")[1] || "N/A",
                      })),

                      certifications: (fullData.certifications || []).map((cert) => ({
                        name: cert.name || "",
                        issuer: cert.issuer || "",
                        year: cert.year || "",
                      })),

                      projects: (fullData.projects || []).map((proj) => ({
                        title: proj.title || "",
                        description: proj.description || "",
                        tags: proj.tech ? proj.tech.split(",").map((t) => t.trim()) : [],
                      })),

                      improvement_areas: fullData.resume_improvement_suggestions || [],
                      upskill_suggestions: fullData.upskill_suggestions || [],
                    };

                    setFile({ name: fullData.filename });
                    setData(normalized);
                    setActiveTab("upload");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;