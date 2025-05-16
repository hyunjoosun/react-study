import Item from "./item";
import "./todolist.scss";

type ListProps = {
  todoList: {text : string, done : boolean}[];
  handleComplete: (index: number) => void;
  handleDelete: (index: number) => void;
};

function List({todoList, handleComplete, handleDelete} : ListProps) {
  return (
    <div className="list">
      <ul>
        {todoList.map((item, index) => (
          <li key={index}>
            <Item item={item} index={index} onComplete={handleComplete} onDelete={handleDelete}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
