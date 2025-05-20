import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import TodoList from "./pages/todolist/index";
import Quiz from "./pages/quiz/index";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1>React Study</h1>
      <div className="card">
        <button onClick={() => navigate("/todolist")}>Todo List</button>
        <button onClick={() => navigate("/quiz")}>Quiz</button>
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
      </Routes>
    </Router>
  );
}

export default App;
