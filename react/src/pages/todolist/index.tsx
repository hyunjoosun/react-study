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
    todoList,
    handleComplete,
    handleDelete,
    handleModify,
    filter,
    handleChecked
  } = useTodoList();

  const filteredList = todoList.filter(item => {
    if (filter === 'done') return item.done;
    if (filter === 'undone') return !item.done;
    return true;
  });
  
  return (
    <div className="container">
      <h2>To do List</h2>
      <InputForm inputValue={inputValue} handleChange={handleChange} handleBtn={handleBtn}/>
      <BtnBox />
      <List
        filteredList={filteredList}
        handleComplete={handleComplete}
        handleDelete={handleDelete}
        handleModify={handleModify}
        handleChecked={handleChecked}
      />
    </div>
  );
}

export default TodoList;
