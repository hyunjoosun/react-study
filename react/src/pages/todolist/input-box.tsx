import "./todolist.scss";
import { useTodoList } from './hook/todoList';

function InputForm() {
  const {inputValue, handleChange, handleBtn} = useTodoList();

  return (
    <div className="form_box">
      <input type="text" className="input" placeholder="내용을 작성해주세요." value={inputValue} onChange={handleChange} />
      <button className="add_btn" onClick={handleBtn}>추가</button>
    </div>
  );
}

export default InputForm;
