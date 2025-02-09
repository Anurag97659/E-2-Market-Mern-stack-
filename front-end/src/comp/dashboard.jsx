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

    const handleDelete = (productId) => {
        alert("Are you sure you want to delete this product?");
    
        fetch("http://localhost:8000/e-2market/v1/products/deleteProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ productId }), 
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert("Product deleted successfully");
                    setsell((prevSell) => prevSell.filter((p) => p._id !== productId)); 
                } else {
                    alert(data.message || "Failed to delete product.");
                }
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
            });
    };
    

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="w-64 h-screen fixed bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dashboard</h2>
                    <div className="space-y-4">
                        <Link to="/search"className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">Search ⫍‍⌕‍⫎ </Link>
                        <Link to="/mycart"className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">My cart 🛒 </Link>
                        <Link to="/Change-details" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">Change Details</Link>
                        <Link to="/Change-password" className="block text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-all">Change Password</Link>
                    </div>
                </div>
                <button onClick={logout} className="mt-10 bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition">Logout</button>
            </div>
            <div className="flex-1 p-8 ml-64">
                <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome, {username}</h2>
                </div>
                <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Products</h2>
                    <div className="flex justify-end mb-4">
                        <Link to="/Add-product" className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">+ Add Product</Link>
                    </div>
                    {sell.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sell.map((product) => (
                               <div
                               key={product._id}
                               className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl w-full h-auto"
                           >
                               <img
                                   src={product.Image}
                                   alt={product.Title}
                                   className="w-full h-48 object-cover rounded-md mb-4"
                               />
                               <h3 className="text-xl font-semibold text-center">{product.Title}</h3>
                               <p className="text-gray-600 text-sm mb-2 text-center overflow-y-auto max-h-20 px-2">
                                   {product.Description}
                               </p>
                               <p className="text-gray-700 font-medium">Price: ₹{product.Price}</p>
                               <p className="text-gray-600 text-sm">Category: {product.Category}</p>
                               <p className="text-gray-600 text-sm">Quantity: {product.Quantity}</p>
                               <div className="flex space-x-2 mt-4">
                                   <Link
                                       to={`/Edit-product/${product._id}`}
                                       className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-yellow-600 transition">
                                       Edit
                                   </Link>
                                   <Link
                                       to={`/Edit-image/${product._id}`}
                                       className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 transition">
                                       Edit Image
                                   </Link>
                                   <button onClick={() => handleDelete(product._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition"
>                                   Delete</button>

                               </div>
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
