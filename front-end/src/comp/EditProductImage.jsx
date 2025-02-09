import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            alert("Please select an image before submitting.");
            return;
        }
        const formData = new FormData();
        formData.append("Image", image);
        try {
            const response = await fetch(
                `http://localhost:8000/e-2market/v1/products/updateImage/${productId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    body: formData,
                }
            );
            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {
                alert("Product image updated successfully!");
                navigate("/dash");
            }
        } catch (error) {
            alert("Error updating product image. Please try again.");
            console.error("Upload Error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Update Product Image
                </h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {preview && (
                    <img src={preview} alt="Product" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-3 w-full bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition">
                    Change Image
                </button>
            </div>
        </div>
    );
}

export default EditProductDetails;
