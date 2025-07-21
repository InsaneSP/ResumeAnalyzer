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
    tags: proj.tech ? proj.tech.split(",").map(t => t.trim()) : [],
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
                <ResumeHistory onView={(data) => {
                  setFile({ name: data.filename });
                  setData(data);
                  setActiveTab("upload");
                }} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;

// Mock data remains unchanged
function mockResponse() {
  return {
    filename: "Smit_Resume.pdf",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 234‑5678",
    location: "Austin, TX",
    core_skills: [
      "JavaScript", "React", "Node.js", "Python", "TypeScript",
      "AWS", "Docker", "MongoDB", "PostgreSQL", "Git", "REST APIs",
    ],
    soft_skills: [
      "Leadership", "Team Collaboration", "Problem Solving", 
      "Communication", "Project Management", "Mentoring",
    ],
    score: 8.7,
    summary:
      "Experienced full‑stack developer with 5+ years building scalable web applications. Strong expertise in React, Node.js, and cloud technologies with proven leadership and mentoring abilities.",
    experiences: [
      {
        title: "Senior Full Stack Developer",
        company: "TechCorp Solutions",
        time: "2022 – Present",
        description: "Led development...",
      },
      {
        title: "Full Stack Developer",
        company: "StartupXYZ",
        time: "2020 – 2022",
        description: "Built and maintained...",
      },
      {
        title: "Frontend Developer",
        company: "Digital Agency Inc",
        time: "2019 – 2020",
        description: "Developed responsive websites...",
      },
    ],
    education: [
      {
        degree: "BSc in Computer Science",
        institution: "University of Texas at Austin",
        year: "2019",
      },
      {
        degree: "Associate Degree in Web Development",
        institution: "Austin Community College",
        year: "2017",
      },
    ],
    certifications: [
      "AWS Certified Developer Associate",
      "Google Cloud Professional Developer",
      "MongoDB Certified Developer",
      "Scrum Master Certification",
    ],
    projects: [
      {
        title: "E‑commerce Platform",
        description: "Built full‑stack e‑commerce...",
        tags: ["React", "Node.js", "MongoDB", "Stripe", "Socket.io"],
      },
      {
        title: "Task Management App",
        description: "Developed collaborative task...",
        tags: ["Vue.js", "Express.js", "PostgreSQL", "WebSocket"],
      },
      {
        title: "Weather Analytics Dashboard",
        description: "Created data visualization...",
        tags: ["Python", "D3.js", "Flask", "Pandas", "Scikit‑learn"],
      },
    ],
    improvement_areas: [
      "Quantify Achievements: Add more specific metrics.",
      "Keywords Optimization: Include more industry-specific keywords.",
      "Leadership Examples: Expand on mentoring experience.",
      "Recent Technologies: Add experience with Next.js, GraphQL, Kubernetes.",
      "Professional Summary: Add a compelling 2–3 line summary.",
    ],
    upskill_suggestions: [
      "Immediate: Learn Kubernetes, Terraform, EKS",
      "Modern Frontend: Next.js, GraphQL, Suspense",
      "Machine Learning: TensorFlow, PyTorch",
      "Mobile: React Native or Flutter",
      "Architecture: Event‑driven, CQRS, DDD",
      "Leadership: Engineering management, team scaling",
      "Certifications: AWS Solutions Architect, CKAD, GCP Cloud Architect",
    ],
  };
}

// Mock Resume History Data
function mockResumeHistoryData() {
  return {
    totalResumes: 5,
    averageRating: 8.3,
    thisMonth: 5,
    topScore: 9.2,
    resumes: [
      {
        resumeName: "sarah_johnson_resume_v2.pdf",
        candidateName: "Sarah Johnson",
        candidateEmail: "sarah.johnson@email.com",
        candidatePhone: "+1 (555) 234-5678",
        uploadDate: "Jan 20, 2024",
        aiScore: 8.7,
        topSkills: ["JavaScript", "React", "Node.js"]
      },
      {
        resumeName: "michael_chen_resume.pdf",
        candidateName: "Michael Chen",
        candidateEmail: "michael.chen@email.com",
        candidatePhone: "+1 (555) 987-6543",
        uploadDate: "Jan 18, 2024",
        aiScore: 7.8,
        topSkills: ["Java", "Spring Boot", "MySQL"]
      },
      {
        resumeName: "emily_rodriguez_data_scientist.pdf",
        candidateName: "Emily Rodriguez",
        candidateEmail: "emily.rodriguez@email.com",
        candidatePhone: "+1 (555) 456-7890",
        uploadDate: "Jan 15, 2024",
        aiScore: 9.2,
        topSkills: ["Python", "Machine Learning", "TensorFlow"]
      },
      {
        resumeName: "david_kim_product_manager.pdf",
        candidateName: "David Kim",
        candidateEmail: "david.kim@email.com",
        candidatePhone: "+1 (555) 321-0987",
        uploadDate: "Jan 12, 2024",
        aiScore: 8.1,
        topSkills: ["Product Management", "Agile", "SQL"]
      },
      {
        resumeName: "lisa_wang_ux_designer.pdf",
        candidateName: "Lisa Wang",
        candidateEmail: "lisa.wang@email.com",
        candidatePhone: "+1 (555) 654-3210",
        uploadDate: "Jan 10, 2024",
        aiScore: 7.5,
        topSkills: ["UI/UX Design", "Figma", "Adobe Creative Suite"]
      }
    ]
  };
}
