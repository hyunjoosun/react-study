import "./quiz.scss";

interface Props {
  result: {
    emoji: string;
    label: string;
  };
  onRetry: () => void;
  onConfirm: () => void;
}

function QuizComplete({ result, onRetry, onConfirm }: Props) {
  return (
    <div className="quiz_complete">
      <div className="complete_box">
        당신은 <br />
        <i>{result.emoji}</i>
        <br />
        <strong>{result.label}</strong> 감정이 가장 많아요!
      </div>
      <div className="bottom_btn">
        <button className="btn" onClick={onRetry}>
          다시하기
        </button>
        <button className="btn" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}

export default QuizComplete;
