import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ResumeHistory from './pages/History';

const mockResumeData = {
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
      topSkills: ["JavaScript", "React", "Node.js"],
    },
    {
      resumeName: "michael_chen_resume.pdf",
      candidateName: "Michael Chen",
      candidateEmail: "michael.chen@email.com",
      candidatePhone: "+1 (555) 987-6543",
      uploadDate: "Jan 18, 2024",
      aiScore: 7.8,
      topSkills: ["Java", "Spring Boot", "MySQL"],
    },
    // Add more resume objects as necessary
  ],
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume-history" element={<ResumeHistory resumeData={mockResumeData}/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
