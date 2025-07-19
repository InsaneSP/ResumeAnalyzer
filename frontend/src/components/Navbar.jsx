import logo from '../assets/LogoResumeAnalyzer.jpg';

const Navbar = () => (
  <div className="text-center py-12 px-4 max-w-4xl mx-auto">
    <div className="flex justify-center items-center gap-3">
      <img src={logo} alt="logo" className="w-12 h-12" />
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mt-1">
        AI Resume Analyzer
      </h1>
    </div>
    <p className="text-gray-700 mt-4 text-lg sm:text-xl font-semibold max-w-3xl mx-auto leading-relaxed">
      Upload your resume for comprehensive AI-powered analysis, skill extraction, and personalized career improvement suggestions
    </p>
    <div className="flex justify-center items-center gap-8 mt-6 text-base sm:text-lg font-semibold text-gray-600">
      <span>⚡ Smart Analysis</span>
      <span>🧠 AI Powered</span>
      <span>📄 PDF Support</span>
    </div>
  </div>
);

export default Navbar;
