import "./quiz.scss";
// import { useQuiz } from "./hook/quiz.ts";

function QuizForm() {
//   const {} = useQuiz();
  
  return (
    <div className="quiz_form">
        <div className="progress_box">
            <div className="progress"></div>
        </div>
        <div className="title">
            친구가 약속 당일 갑자기<br/>
            오늘 못 갈 것 같아 미안해<br/>
            라고 했을 때 나는?
        </div>
        <div className="btn_box">
            <button className="btn">엥 진짜 짜증나네</button>
            <button className="btn">무슨 일 있어? 괜찮아 다음에 보자</button>
        </div>
    </div>
  );
}

export default QuizForm;
