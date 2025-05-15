import InputForm from "./input-box";
import BtnBox from "./btn-box";
import List from "./list";
import "./todolist.scss";

function TodoList() {
  return (
    <div className="todo_box">
      <h2>To do List</h2>
      <InputForm />
      <BtnBox />
      <List />
    </div>
  );
}

export default TodoList;
