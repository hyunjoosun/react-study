import "./todolist.scss";

function BtnBox() {
  return (
    <div className="top_box">
      <div className="check_box">
        <input type="checkbox" className="check" />
      </div>
      <div className="btn_box">
        <button className="btn">완료보기</button>
        <button className="btn">미완료보기</button>
        <button className="btn">전체보기</button>
        <button className="btn">선택삭제</button>
        <button className="btn">전체삭제</button>
      </div>
    </div>
  );
}

export default BtnBox;
