// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Upload from "./Pages/Upload";
import VideoList from "./Pages/VideoList";
import VideoPlayer from "./Pages/VideoPlayer";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./context/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute roles={["creator"]}>
              <Upload />
            </PrivateRoute>
          }
        />
        <Route path="/videos" element={<VideoList />} />
        <Route path="/videos/:id" element={<VideoPlayer />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
