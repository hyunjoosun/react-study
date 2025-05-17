import "./quiz.scss";
import img from "../../assets/quiz_main.png";

function QuizMain({ onStart }: { onStart: () => void }) {
  return (
    <div className="quiz_main">
      <h2>Quiz</h2>
      <div className="img_box">
        <img src={img} alt="다중이 성격 테스트" />
      </div>
      <button className="start_btn" onClick={onStart}>
        시작하기
      </button>
    </div>
  );
}

export default QuizMain;
