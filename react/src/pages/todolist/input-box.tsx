/* eslint-disable no-empty-pattern */
import "./todolist.scss";
import { useTodoList } from "./hook/todoList.ts";

function InputForm() {
  const {} = useTodoList();

  return (
    <div className="form_box">
      <input type="text" className="input" />
      <button className="add_btn">추가</button>
    </div>
  );
}

export default InputForm;
