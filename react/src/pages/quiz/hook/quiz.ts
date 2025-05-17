// src/components/hook/useQuiz.ts
import { useState } from "react";

export type QuizStep = "main" | "form" | "complete";

interface Question {
  title: string;
  options: string[];
}

const questions: Question[] = [
  {
    title: "친구가 약속 당일 갑자기\n오늘 못 갈 것 같아 미안해\n라고 했을 때 나는?",
    options: ["엥 진짜 짜증나네", "무슨 일 있어? 괜찮아 다음에 보자"]
  },
  {
    title: "회의 중 내 의견을 무시당했을 때 나는?",
    options: ["말을 끊다니 무례하네", "조용히 넘어가고 나중에 얘기함"]
  }
];

export function useQuiz() {
  const [step, setStep] = useState<QuizStep>("main");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const startQuiz = () => {
    setStep("form");
    setCurrentIndex(0);
    setAnswers([]);
  };

  const answerQuestion = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStep("complete");
    }
  };

  const retryQuiz = () => {
    setStep("main");
    setCurrentIndex(0);
    setAnswers([]);
  };

  const confirmQuiz = () => {
    window.location.href = "/";
  };

  const getResult = () => {
    const angryCount = answers.filter((a) => a.includes("짜증") || a.includes("무례")).length;
    const angelCount = answers.length - angryCount;

    return angryCount > angelCount
      ? { emoji: "😠", label: "화남" }
      : { emoji: "😊", label: "천사" };
  };

  return {
    step,
    question: questions[currentIndex],
    questionIndex: currentIndex,
    totalQuestions: questions.length,
    answers,
    startQuiz,
    answerQuestion,
    retryQuiz,
    confirmQuiz,
    getResult
  };
}
