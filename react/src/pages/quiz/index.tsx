import { useQuiz } from "./hook/quiz";
import QuizMain from "./quizMain";
import QuizForm from "./quizForm";
import QuizComplete from "./quizComplete";
import "./quiz.scss";

function Quiz() {
  const quiz = useQuiz();

  return (
    <div className="container quiz">
      {quiz.step === "main" && <QuizMain onStart={quiz.startQuiz} />}
      {quiz.step === "form" && (
        <QuizForm
          question={quiz.question}
          index={quiz.questionIndex}
          total={quiz.totalQuestions}
          onAnswer={quiz.answerQuestion}
        />
      )}
      {quiz.step === "complete" && (
        <QuizComplete
          result={quiz.getResult()}
          onRetry={quiz.retryQuiz}
          onConfirm={quiz.confirmQuiz}
        />
      )}
    </div>
  );
}

export default Quiz;
