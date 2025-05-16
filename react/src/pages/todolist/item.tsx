import { useState } from "react";
import "./todolist.scss";

type ItemProps = {
  item : {text : string, done : boolean};
  index : number;
  onComplete : (index : number) => void;
  onDelete : (index : number) => void;
  onModify : (index : number, newText: string) => void;
}

function Item({item, index, onComplete, onDelete, onModify} : ItemProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState(item.text);
  const handleEdit = () => {
    setIsEdit(true);
    setEditValue(item.text);
  };
  const handleEditValue = (e:any) => {
    setEditValue(e.target.value);
  };
  const handleEditComplete = () => {
    if (editValue === '') return;
    onModify(index, editValue);
    setIsEdit(false);
  };
  
  return (
    <div className={`item_box ${item.done ? 'complete' : ''}`}>
      <div className="check_box">
        {!isEdit ? (
          <>
            <input type="checkbox" className="check" checked={item.done}/>
            <label htmlFor="" className="txt">{item.text}</label>
          </>
        ) : (
          <div className="modify_box">
              <div className="input_box">
                <input type="text" className="input" value={editValue} onChange={handleEditValue}/>
              </div>
              <div className="btn_box">
                <button className="btn modify" onClick={handleEditComplete}>확인</button>
              </div>
          </div>
        )}
      </div>
      <div className="btn_box">
        <button className="btn modify" onClick={handleEdit}>수정</button>
        <button className="btn complete" onClick={() => onComplete(index)}>
          {item.done ? '취소' : "완료"}
        </button>
        <button className="btn delete" onClick={() => onDelete(index)}>삭제</button>
      </div>
    </div>
  );
}

export default Item;
