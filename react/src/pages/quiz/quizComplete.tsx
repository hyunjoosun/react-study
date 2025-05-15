import "./quiz.scss";
// import { useQuiz } from "./hook/quiz.ts";

function QuizComplete() {
//   const {} = useQuiz();
  
  return (
    <div className="quiz_complete">
        <div className="complete_box">
            당신은 <br />
            <i>😊</i><br />
            <strong>천사</strong> 감정이 가장 많아요!
        </div>
        <div className="bottom_btn">
            <button className="btn">다시하기</button>
            <button className="btn">확인</button>
        </div>
    </div>
  );
}

export default QuizComplete;
