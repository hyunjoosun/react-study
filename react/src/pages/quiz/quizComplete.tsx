import "./quiz.scss";

type QuizCompleteProps = {
  result: string;
  onRestart: () => void;
};

function QuizComplete({result, onRestart} : QuizCompleteProps) {
  return (
    <div className="quiz_complete">
      <div className="complete_box">
        당신은 <br />
        {result === "천사" && <i>😊</i>}
        {result === "화남" && <i>😠</i>}
        <br />
        <strong>{result}</strong> 감정이 가장 많아요!
      </div>
      <div className="bottom_btn">
        <button className="btn" onClick={onRestart}>
          다시하기
        </button>
        <button className="btn" onClick={() => (window.location.href = "/")}>
          확인
        </button>
      </div>
    </div>
  );
}

export default QuizComplete;
