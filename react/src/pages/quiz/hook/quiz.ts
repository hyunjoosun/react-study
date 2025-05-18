// src/components/hook/useQuiz.ts
import { useState } from "react";

const quizData = [
  {
    question : "친구가 약속 당일 갑자기\n오늘 못 갈 것 같아 미안해\n라고 했을 때 나는?",
    answer : ["엥 진짜 짜증나네", "무슨 일 있어? 괜찮아 다음에 보자"],
    result : ["화남", "천사"],
  },
  {
    question : "회의 중 내 의견을 무시당했을 때 나는?",
    answer : ["말을 끊다니 무례하네", "조용히 넘어가고 나중에 얘기함"],
    result : ["화남", "천사"],
  },
];

export function useQuiz() {
  // 처음에는 메인만 보이고, 그 다음에 폼, 마지막에 완료 보이게
  const [step, setStep] = useState<"main" | "form" | "complete">("main");
  const [question, setQuestion] = useState(0);
  const [resultAnswer,setResultAnswer] = useState<string[]>([]);

  //시작하기 버튼 클릭 시 폼으로 넘어가게
  const startQuiz = () => {
    setStep("form");
    setQuestion(0);
    setResultAnswer([]);
  };

  //form에서 질문, 답변 선택
  const selectAnswer = (result : string) => {
    const nextResult = [...resultAnswer, result];
    setResultAnswer(nextResult);

    if (question + 1 < quizData.length) {
      setQuestion(question + 1);
    } else {
      setStep("complete");
    };
  };

  //결과에서 다시하기 클릭 시 메인으로
  const restartQuiz = () => {
    setStep("main");
    setQuestion(0);
    setResultAnswer([]);
  };

  //결과 나오기 (천사/악마 이모티콘, 텍스트)
  // const resultIcon = () => {};

  return {
    step,
    startQuiz,
    quizData,
    question,
    resultAnswer,
    selectAnswer,
    restartQuiz
  };
}
