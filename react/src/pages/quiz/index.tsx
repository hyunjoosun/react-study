import QuizMain from "./quizMain.tsx";
import QuizForm from "./quizForm.tsx";
import QuizComplete from "./quizComplete.tsx";
import "./quiz.scss";
// import { useQuiz } from "./hook/quiz.ts";

function Quiz() {
  // const {} = useQuiz();
  
  return (
    <div className="container">
      <QuizMain />
      <QuizForm />
      <QuizComplete />
    </div>
  );
}

export default Quiz;
