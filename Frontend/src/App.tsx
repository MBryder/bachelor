import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
import About from "./pages/About";
import "./App.css";
import PrivateRoute from "./components/privateRoute";

import { SelectedRouteProvider } from "./context/SelectedRouteContext";
import { SelectedPlacesProvider } from "./context/SelectedPlacesContext"

function App() {
  return (
    <SelectedRouteProvider>
      <SelectedPlacesProvider>
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

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <About />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </SelectedPlacesProvider>
    </SelectedRouteProvider>
  );
}

export default App;
