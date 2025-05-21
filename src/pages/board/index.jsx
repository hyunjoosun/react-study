import "./board.css";
import BoardList from "./board-list"

function Board() {
  return <div className="board_wrap">
    <div className="header">헤더</div>
    <div className="board_list">
      <BoardList />
    </div>
    <div className="footer">헤더</div>
  </div>;
}

export default Board;
