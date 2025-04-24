import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import './App.css'
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
      </Routes>
    </Router>
  )
}

export default App
