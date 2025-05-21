import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import TodoList from "./pages/todolist/index";
import Quiz from "./pages/quiz/index";
import Board from "./pages/board/index";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1>React Study</h1>
      <div className="card">
        <button onClick={() => navigate("/todolist")}>Todo List</button>
        <button onClick={() => navigate("/quiz")}>Quiz</button>
        <button onClick={() => navigate("/board")}>Board</button>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todolist" element={<TodoList />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
