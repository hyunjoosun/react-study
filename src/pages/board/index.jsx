import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./board.css";
import BoardView from "./board-view";
import BoardList from "./board-list";

function Board() {
  const navigate = useNavigate();

  return (
    <div className="board_wrap">
      <div className="header">
        <h2>게시판</h2>
      </div>
      <div className="board_list">
        <BoardList />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <button onClick={() => navigate("/board/:id")}>
          <BoardView />
        </button>
      </Routes>
    </Router>
  );
}

export default App;
