import "./quiz.scss";

type QuizFormProps = {
  question : string;
  answer : string[];
  onAnswer : (answer : string ) => void;
  progress : number;
};

function QuizForm({question, answer, onAnswer} : QuizFormProps) {
  return (
    <div className="quiz_form">
      <div className="progress_box">
        <div className="progress" style={{ width : '${progress * 100%}%'}} ></div>
      </div>
      <div className="title">
        {question}
      </div>
      <div className="btn_box">
        {answer.map((text, idx) => (
          <button key={idx} className="btn" onClick={() => onAnswer(text)}>{text}</button>
        ))}
      </div>
    </div>
  );
}

export default QuizForm;
