import "./todolist.scss";

function Item() {
  return (
    <div className="item_box complete">
      <div className="check_box">
        <input type="checkbox" className="check" />
        <label className="txt">내용이 길어지면 내용이 길어지면 </label>
      </div>
      <div className="btn_box">
        <button className="btn modify">수정</button>
        <button className="btn complete">완료</button>
        <button className="btn delete">삭제</button>
      </div>
    </div>
  );
}

export default Item;
