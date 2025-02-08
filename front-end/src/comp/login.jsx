import React,{ useState } from "react";
import { Link } from "react-router-dom";

function Login() {
   const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const submit = (e) => {
      e.preventDefault();
      console.log( password, username);
      try {
        fetch('http://localhost:8000/e-2market/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password}),
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Login successful');
                    window.location.href = '/dash';
                }
            })
            .catch((error) => {
                alert("login failed file login.jsx error");
            });
    
    } catch (error) {
        alert(error);
        
    }
    }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={submit} id="form" className="space-y-4">
          <div>
            <label
              htmlFor="uname"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              name="uname"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="psw"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              name="psw"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
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

export default Login;
