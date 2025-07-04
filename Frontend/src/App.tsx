import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
import About from "./pages/About";
import ShareRoute from "./pages/ShareRoute";
import "./App.css";
import PrivateRoute from "./components/privateRoute";

import { SelectedRouteProvider } from "./context/SelectedRouteContext";
import { SelectedPlacesProvider } from "./context/SelectedPlacesContext";
import { UserLocationProvider } from "./context/UserLocationContext";

function App() {
  return (
    <SelectedRouteProvider>
      <SelectedPlacesProvider>
        <UserLocationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/shared-route/:routeId" element={<ShareRoute />} />
              {/* Private Routes */}
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
              {/* Redirect all unknown routes to /Login*/}
              <Route path="*" element={<Login />} />
            </Routes>
          </Router>
        </UserLocationProvider>
      </SelectedPlacesProvider>
    </SelectedRouteProvider>
  );
}

export default App;
