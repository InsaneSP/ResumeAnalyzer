import { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaFilePdf, FaDownload } from 'react-icons/fa';

const ResumeHistory = ({ onView }) => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/history/');
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setResumeData(data);
      } catch (err) {
        setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleAction = async (action, resumeName) => {
    if (action === 'Delete') {
      if (!window.confirm(`Are you sure you want to delete ${resumeName}?`)) return;

      try {
        const response = await fetch(`http://localhost:8000/history/${resumeName}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete');

        setResumeData((prev) => ({
          ...prev,
          resumes: prev.resumes.filter((r) => r.resumeName !== resumeName),
          totalResumes: prev.totalResumes - 1,
        }));
      } catch (err) {
        alert(`Error deleting: ${err.message}`);
      }
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="py-6 px-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Resumes" value={resumeData.totalResumes} icon={<FaFilePdf />} color="blue" />
        <StatCard title="Average Rating" value={`${resumeData.averageRating} / 10`} icon={<FaDownload />} color="green" />
        <StatCard title="This Month" value={resumeData.thisMonth} icon={<FaEye />} color="purple" />
        <StatCard title="Top Score" value={resumeData.topScore} icon={<FaDownload />} color="orange" />
      </div>

      {/* Resume Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Resume Details</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Candidate Info</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Upload Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">AI Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Top Skills</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumeData.resumes.map((resume, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-800">
                    <div className="flex items-center space-x-3">
                      <FaFilePdf className="text-blue-600" />
                      <span>{resume.resumeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <p>{resume.candidateName}</p>
                    <p>{resume.candidateEmail}</p>
                    <p>{resume.candidatePhone}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{resume.uploadDate}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${getScoreColor(resume.aiScore)}`}>
                      {resume.aiScore} / 10
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {resume.topSkills.map((skill, idx) => (
                      <span key={idx} className="text-xs text-blue-500 bg-blue-100 rounded-full px-2 py-1 mr-2">
                        {skill}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-4 text-sm flex items-center gap-4 justify-start">
                    <button
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                      onClick={async () => {
                        try {
                          const res = await fetch(`http://localhost:8000/resume-by-filename/${resume.resumeName}`);
                          if (!res.ok) throw new Error("Analysis not found");
                          const fullData = await res.json();
                          onView(fullData);
                        } catch (err) {
                          alert("Error fetching analysis");
                        }
                      }}
                    >
                      <FaEye className="inline" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center gap-2"
                      onClick={() => handleAction('Delete', resume.resumeName)}
                    >
                      <FaTrash className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-${color}-500 text-white p-6 rounded-lg flex items-center justify-between`}>
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl">{value}</p>
    </div>
    <div className={`bg-${color}-700 p-4 rounded-full`}>
      {icon}
    </div>
  </div>
);

// Score badge color
const getScoreColor = (score) => {
  if (score >= 8) return 'bg-green-100 text-green-600';
  if (score >= 7) return 'bg-yellow-100 text-yellow-600';
  return 'bg-red-100 text-red-600';
};

export default ResumeHistory;
