// src/components/Navbar.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800">
      <div className="text-white p-4 flex justify-between container m-auto">
        <div>
          {/* <Link to="/" className="mr-4 font-bold text-xl">
          VideoApp
        </Link> */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="mr-4 font-bold text-xl"
          >
            VideoApp
          </Link>
          <Link to="/videos" className="mr-4">
            Explore
          </Link>
          {user && user.role === "creator" && (
            <Link to="/upload" className="mr-4">
              Upload
            </Link>
          )}
        </div>
        <div>
          {user ? (
            <>
              <span className="mr-4">Hi, {user.username}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
