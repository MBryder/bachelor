import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Home from "./pages/Home";
import Test from "./pages/test";
import './App.css'

function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/home" element={<Home />} />
                <Route path="/test" element={<Test />} />
            </Routes>
    </Router>
)
}

export default App
