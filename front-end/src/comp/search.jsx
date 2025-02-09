import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [result, setResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const submit = (e) => {
    e.preventDefault();
    fetch(
      `http://localhost:8000/e-2market/v1/products/search?search=${searchQuery}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          window.location.href = "/login";
        }
        return res.json();
      })
      .then((data) => {
        setResult(data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  };

  const addToCart = (productId) => {
    fetch("http://localhost:8000/e-2market/v1/products/addToCart", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Product added to cart!");
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 h-screen fixed bg-white shadow-lg p-6 flex flex-col justify-between border-r">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-wide">
            Search <span className="inline-block">⫍‍⌕‍⫎</span>
          </h2>
          <div className="space-y-3">
                          <Link to="/dash" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">📊 Dashboard</Link>
              
                          <Link to="/mycart" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all flex items-center gap-2">🛒 My Cart  </Link>
              
                          <Link to="/Change-details" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">✏️ Change Details</Link>
              
                          <Link to="/Change-password" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">🔑 Change Password</Link>
                        </div>
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all font-semibold text-lg"
        >
          🚪 Logout
        </button>
      </aside>

      <main className="flex-1 p-10 ml-72">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, {username}
          </h2>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <form onSubmit={submit} className="flex gap-3 w-full max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all font-semibold"
            >
              🔍 Search
            </button>
          </form>
        </div>
        <div className="mt-10">
          {result.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {result.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
                >
                  <img
                    src={product.Image}
                    alt={product.Name}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-800">
                    {product.Title}
                  </h3>
                  <p className="text-gray-600 font-semibold">
                    ₹{product.Price}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {product.Description}
                  </p>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="mt-3 w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all font-semibold"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg text-center mt-6">
              No products found
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

const NavItem = ({ to, location, children }) => {
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`block font-medium py-3 px-4 rounded-md transition-all ${
        isActive
          ? "bg-blue-500 text-white"
          : "text-gray-700 hover:bg-blue-100 hover:text-blue-800"
      }`}
    >
      {children}
    </Link>
  );
};

export default Search;
