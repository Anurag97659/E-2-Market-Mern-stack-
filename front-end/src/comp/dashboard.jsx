import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dash() {
    const [username, setUsername] = useState("");
    const [sell, setsell] = useState([]);

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

    useEffect(() => {
        fetch("http://localhost:8000/e-2market/v1/products/sell", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("API Response:", data);
                setsell(data?.data || []);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
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
            {/* Sidebar (Static) */}
            <div className="w-64 h-screen fixed bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dashboard</h2>
                    <div className="space-y-4">
                        <Link
                            to="/Change-details"
                            className="block text-blue-600 hover:text-blue-700 transition font-medium"
                        >
                            Change Details
                        </Link>
                        <Link
                            to="/Change-password"
                            className="block text-blue-600 hover:text-blue-700 transition font-medium"
                        >
                            Change Password
                        </Link>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="mt-10 bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            {/* Main Content (Push right to avoid sidebar overlap) */}
            <div className="flex-1 p-8 ml-64">
                {/* Welcome Section */}
                <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome, {username}</h2>
                </div>

                {/* Products Section */}
                <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Your Products
                    </h2>
                    <div className="flex justify-end mb-4">
                        <Link
                            to="/Add-product"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            + Add Product
                        </Link>
                    </div>

                    {/* Product List */}
                    {sell.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sell.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl w-full h-[350px]"
                                >
                                    <img
                                        src={product.Image}
                                        alt={product.Title}
                                        className="w-full h-48 object-cover rounded-md mb-4"
                                    />
                                    <h3 className="text-xl font-semibold">{product.Title}</h3>
                                    <p className="text-gray-600 text-sm mb-2 text-center">{product.Description}</p>
                                    <p className="text-gray-700 font-medium">Price: ₹{product.Price}</p>
                                    <p className="text-gray-600 text-sm">Category: {product.Category}</p>
                                    <p className="text-gray-600 text-sm">Quantity: {product.Quantity}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No products listed yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dash;
