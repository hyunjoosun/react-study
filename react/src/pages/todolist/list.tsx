import Item from "./item";
import "./todolist.scss";

type ListProps = {
  filteredList: { text: string; done: boolean; checked: boolean }[];
  handleComplete: (index: number) => void;
  handleDelete: (index: number) => void;
  handleModify: (index: number, newText: string) => void;
  handleChecked: (index: number, checked: boolean) => void;
};

function List({ filteredList, handleComplete, handleDelete, handleModify, handleChecked }: ListProps) {
  return (
    <div className="list">
      <ul>
        {filteredList.map((item, index) => (
          <li key={index}>
            <Item
              item={item}
              index={index}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onModify={handleModify}
              onChecked={handleChecked}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
