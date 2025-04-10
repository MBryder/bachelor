import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Home from "./pages/Home";
import Test from "./pages/test";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import './App.css'

function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/home" element={<Home />} />
                <Route path="/test" element={<Test />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
    </Router>
)
}

export default App
