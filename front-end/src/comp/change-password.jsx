import React,{ useState } from "react";
import { Link } from "react-router-dom";

function ChangePassword() {
    const [oldPassword, setoldpassword] = useState('');
    const [newPassword, setnewpassword] = useState('');
    const [confirmPassword, setconfirmpassword] = useState('');
    const submit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('password not matched');
        }
      try {
        fetch('http://localhost:8000/e-2market/v1/users/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword}),
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Password changed successful');
                    window.location.href = '/login';
                }
            })
            .catch((error) => {
                alert("password change failed file change-password.jsx error");
            });
    
    } catch (error) {
        alert(error);
        
    }
    }
  
   
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Change password
        </h2>
        <form onSubmit={submit} id="form" className="space-y-4">
          <div>
            <label
              htmlFor="uname"
              className="block text-sm font-medium text-gray-700"
            >
                Old Password
            </label>
            <input
              type="text"
              id="old"
              placeholder="Enter Old Password"
              name="uname"
              value={oldPassword}
              onChange={(e) => setoldpassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="psw"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="new"
              placeholder="Enter Password"
              name="psw"
              value={newPassword}
              onChange={(e) => setnewpassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="pswc"
              className="block text-sm font-medium text-gray-700"
            >
              confirm Password
            </label>
            <input
              type="password"
              id="old"
              placeholder="Enter Password"
              name="pswc"
              value={confirmPassword}
              onChange={(e) => setconfirmpassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Change Password
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Create account{" "}
          <Link to="/registration" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      
    </div>
  );
}

export default  ChangePassword;
