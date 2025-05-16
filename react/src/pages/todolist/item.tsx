import "./todolist.scss";

type ItemProps = {
  item : {text : string, done : boolean};
  index : number;
  onComplete : (index : number) => void;
  onDelete : (index : number) => void;
}

function Item({item, index, onComplete, onDelete} : ItemProps) {
  return (
    <div className={`item_box ${item.done ? 'complete' : ''}`}>
      <div className="check_box">
        <input type="checkbox" className="check" />
        <label htmlFor="" className="txt">{item.text}</label>
      </div>
      <div className="btn_box">
        <button className="btn modify">수정</button>
        <button className="btn complete" onClick={() => onComplete(index)}>
          {item.done ? '취소' : "완료"}
        </button>
        <button className="btn delete" onClick={() => onDelete(index)}>삭제</button>
      </div>
    </div>
  );
}

export default Item;
