import "./quiz.scss";

interface Props {
  question: {
    title: string;
    options: string[];
  };
  index: number;
  total: number;
  onAnswer: (answer: string) => void;
}

function QuizForm({ question, index, total, onAnswer }: Props) {
  return (
    <div className="quiz_form">
      <div className="progress_box">
        <div
          className="progress"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        ></div>
      </div>
      <div className="title">
        {question.title.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="btn_box">
        {question.options.map((opt, i) => (
          <button key={i} className="btn" onClick={() => onAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizForm;
