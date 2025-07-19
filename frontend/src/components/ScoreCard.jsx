const ScoreCard = ({ score, summary }) => (
  <div className="bg-green-50 p-4 rounded shadow mt-4">
    <h4 className="font-semibold mb-2">Resume Score</h4>
    <div className="flex items-center justify-center mb-2">
      <div className="w-20 h-20 rounded-full border-4 border-green-600 flex items-center justify-center text-2xl font-bold text-green-600">
        {score}
      </div>
    </div>
    <p className="text-green-700 text-center">{summary}</p>
  </div>
);

export default ScoreCard;
