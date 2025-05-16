import "./todolist.scss";

type TextProps = {
  text : string;
}

function Item({text} : TextProps) {
  return (
    <div className="item_box complete">
      <div className="check_box">
        <input type="checkbox" className="check" />
        <label htmlFor="" className="txt">{text}</label>
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
