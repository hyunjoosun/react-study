import InputForm from "./input-box";
import BtnBox from "./btn-box";
import List from "./list";
import "./todolist.scss";
import { useTodoList } from "./hook/todoList.ts";

function TodoList() {
  const {} = useTodoList();
  
  return (
    <div className="container">
      <h2>To do List</h2>
      <InputForm />
      <BtnBox />
      <List />
    </div>
  );
}

export default TodoList;
