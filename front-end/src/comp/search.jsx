import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Search() {
  const [username, setUsername] = useState("");
  useEffect(() => {
    fetch("http://localhost:8000/e-2market/v1/users/getUsername", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          window.location.href = "/login";
        }
        return res.json();
      })
      .then((data) => {
        setUsername(String(data.data.username).toUpperCase());
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, []);
  const logout = () => {
    fetch("http://localhost:8000/e-2market/v1/users/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          alert("Logged out successfully");
          window.location.href = "/login";
        } else {
          alert("Logout failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 h-screen fixed bg-white shadow-xl p-6 flex flex-col justify-between border-r">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-wide">
            Search <span className="inline-block">⫍‍⌕‍⫎</span>
          </h2>
          <div className="space-y-3">
            <Link to="/dash" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">📊 Dashboard</Link>

            <Link to="/mycart" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all flex items-center gap-2">🛒 My Cart</Link>

            <Link to="/Change-details" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">✏️ Change Details</Link>

            <Link to="/Change-password" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">🔑 Change Password</Link>
          </div>
        </div>
        <button onClick={logout} className="w-full bg-red-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all font-semibold text-lg">🚪 Logout</button>
      </div>

      <div className="flex-1 p-8 ml-64">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, {username}
          </h2>
        </div>

        <div>
          <p>will complete search work later</p>
        </div>
        
      </div>
    </div>
  );
}
export default Search;
