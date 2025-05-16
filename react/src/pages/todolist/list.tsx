import Item from "./item";
import "./todolist.scss";

type ListProps = {
  todoList: string[];
};

function List({todoList} : ListProps) {
  return (
    <div className="list">
      <ul>
        {todoList.map((todo, index) => (
          <li key={index}>
            <Item text={todo}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
