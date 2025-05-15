import Item from "./item";
import "./todolist.scss";

function List() {
  return (
    <div className="list">
      <ul>
        <li>
          <Item />
        </li>
      </ul>
    </div>
  );
}

export default List;
