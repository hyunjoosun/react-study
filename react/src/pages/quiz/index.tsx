import { useQuiz } from "./hook/quiz";
import QuizMain from "./quizMain";
import QuizForm from "./quizForm";
import QuizComplete from "./quizComplete";
import "./quiz.scss";

function Quiz() {
  const quiz = useQuiz();
  const total = quiz.quizData.length;
  const current = quiz.question;
  const currentQuiz = quiz.quizData[current];

  return (
    <div className="container quiz">
      {quiz.step === "main" && <QuizMain onStart={quiz.startQuiz} />}
      {quiz.step === "form" && (
        <QuizForm 
          question={currentQuiz.question} 
          answer={currentQuiz.answer} 
          onAnswer={(text) => {
            const index = currentQuiz.answer.indexOf(text);
            const result = currentQuiz.result[index];
            quiz.selectAnswer(result); 
          }} 
          progress={(current + 1) / total}
        />
      )}
      {quiz.step === "complete" && (
        <QuizComplete 
          onRestart={quiz.restartQuiz} result={quiz.resultIcon()} />
      )}
    </div>
  );
}

export default Quiz;
