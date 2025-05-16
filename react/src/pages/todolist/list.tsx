import Item from "./item";
import "./todolist.scss";

type ListProps = {
  todoList: {text : string, done : boolean}[];
  handleComplete: (index: number) => void;
  handleDelete: (index: number) => void;
  handleModify: (index: number) => void;
};

function List({todoList, handleComplete, handleDelete, handleModify} : ListProps) {
  return (
    <div className="list">
      <ul>
        {todoList.map((item, index) => (
          <li key={index}>
            <Item item={item} index={index} onComplete={handleComplete} onDelete={handleDelete} onModify={handleModify}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
