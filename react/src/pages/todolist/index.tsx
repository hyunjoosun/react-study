import InputForm from "./input-box";
import BtnBox from "./btn-box";
import List from "./list";
import "./todolist.scss";
import { useTodoList } from "./hook/todoList.ts";

function TodoList() {
  const {
    inputValue,
    handleChange,
    handleBtn,
    todoList
  } = useTodoList();
  
  return (
    <div className="container">
      <h2>To do List</h2>
      <InputForm inputValue={inputValue} handleChange={handleChange} handleBtn={handleBtn}/>
      <BtnBox />
      <List todoList={todoList}/>
    </div>
  );
}

export default TodoList;
