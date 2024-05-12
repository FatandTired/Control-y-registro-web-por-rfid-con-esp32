import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/navBar";
import Logs from "./screens/Logs";
import CreateStudent from "./screens/CreateStudent";
import Students from "./screens/Students";

export default function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Logs />} />
          <Route path="/create" element={<CreateStudent />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </Router>
    </div>
  );
}
