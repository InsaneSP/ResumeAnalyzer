import {
  FaDownload,
  FaBook,
  FaSyncAlt,
  FaCogs,
  FaUsers,
  FaBriefcase,
  FaUniversity,
  FaCertificate,
  FaProjectDiagram,
  FaChartLine,
  FaGraduationCap,
  FaShareAlt,
} from 'react-icons/fa';
import ScoreCard from './ScoreCard';

const AnalysisResult = ({ data }) => {
  const initials = data?.name
    ? data.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "NA";

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Analysis Complete</h2>
          <p className="text-gray-500 text-sm mt-1">
            File: <span className="font-medium">{data?.filename || "Unknown"}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm">
            <FaDownload className="inline mr-2" /> Export PDF
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm">
            <FaShareAlt className="inline mr-2" /> Share
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
            <FaSyncAlt className="inline mr-2" /> New Analysis
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-md text-center">
            <div className="mx-auto mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
              {initials}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{data?.name || "NA"}</h3>
            <p className="text-gray-500 text-sm">{data?.email || "Not provided"}</p>
            <p className="text-gray-500 text-sm">{data?.phone || "Not provided"}</p>
            <p className="text-gray-500 text-sm">{data?.location || "Location not available"}</p>
          </div>
          <ScoreCard score={data?.score || 0} summary={data?.summary || "No summary available"} />
        </aside>

        <main className="lg:col-span-2 space-y-6">
          <TagSection
            title="Core Skills"
            items={data?.core_skills || []}
            colorClasses="bg-blue-100 text-blue-700"
            icon={<FaCogs className="text-blue-600 mr-2" />}
          />
          <TagSection
            title="Soft Skills"
            items={data?.soft_skills || []}
            colorClasses="bg-green-100 text-green-700"
            icon={<FaUsers className="text-green-600 mr-2" />}
          />
          <ExperienceSection experiences={data?.experiences || []} />
          <OtherSections data={data} />
        </main>
      </div>

      <div className="bg-blue-50 text-center p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Ready to Improve Your Resume?
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Use these insights to create a more compelling resume that stands out to employers.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-md flex items-center gap-2">
            <FaDownload className="text-lg" />
            Download Analysis Report
          </button>
          <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm font-semibold shadow-md flex items-center gap-2">
            <FaBook className="text-lg" />
            View Learning Resources
          </button>
        </div>
      </div>
    </div>
  );
};

const TagSection = ({ title, items = [], colorClasses, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow-md">
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.length > 0
        ? items.map((item, idx) => (
            <span key={idx} className={`text-sm px-3 py-1 rounded-full ${colorClasses}`}>
              {item}
            </span>
          ))
        : <span>No data available</span>}
    </div>
  </div>
);

const ExperienceSection = ({ experiences = [] }) => (
  <div className="bg-white p-5 rounded-xl shadow-md">
    <div className="flex items-center mb-3">
      <FaBriefcase className="text-purple-600 mr-2" />
      <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
    </div>
    <div className="space-y-5">
      {experiences.length > 0 ? experiences.map((exp, idx) => (
        <div key={idx} className="border-l-4 border-purple-300 pl-4">
          <h4 className="text-md font-semibold text-gray-800">{exp.title || "Untitled Role"}</h4>
          <p className="text-purple-600 text-sm">{exp.company || "Unknown Company"} • {exp.time || "N/A"}</p>
          <p className="text-gray-600 text-sm mt-1">{exp.description || "No description available"}</p>
        </div>
      )) : <p>No experience listed</p>}
    </div>
  </div>
);

const OtherSections = ({ data }) => (
  <>
    <TagSection
      title="Education"
      items={
        Array.isArray(data?.education)
          ? data.education.map((e) =>
              `${e.degree || "Degree"}, ${e.institution || "Institution"} (${e.year || "Year"})`
            )
          : []
      }
      colorClasses="bg-indigo-100 text-indigo-700"
      icon={<FaUniversity className="text-indigo-600 mr-2" />}
    />
    <TagSection
      title="Certifications"
      items={
        Array.isArray(data?.certifications)
          ? data.certifications.map(
              (cert) => `${cert.name || "Certificate"} — ${cert.issuer || "Issuer"} (${cert.year || "Year"})`
            )
          : []
      }
      colorClasses="bg-yellow-100 text-yellow-700"
      icon={<FaCertificate className="text-yellow-600 mr-2" />}
    />
    <TagSection
      title="Projects"
      items={
        Array.isArray(data?.projects)
          ? data.projects.map((p) => p.title || "Untitled Project")
          : []
      }
      colorClasses="bg-orange-100 text-orange-700"
      icon={<FaProjectDiagram className="text-orange-600 mr-2" />}
    />
    <TagSection
      title="Improvement Areas"
      items={Array.isArray(data?.improvement_areas) ? data.improvement_areas : []}
      colorClasses="bg-red-100 text-red-700"
      icon={<FaChartLine className="text-red-600 mr-2" />}
    />
    <TagSection
      title="Upskill Recommendations"
      items={Array.isArray(data?.upskill_suggestions) ? data.upskill_suggestions : []}
      colorClasses="bg-teal-100 text-teal-700"
      icon={<FaGraduationCap className="text-teal-600 mr-2" />}
    />
  </>
);

export default AnalysisResult;
