import React,{ useState } from "react";

function ChangePassword() {
  const [username, setUsername] = useState("");
  const[email,setEmail]=useState("");
  const[fullname,setFullname]=useState("");
    const submit = (e) => {
        e.preventDefault();
       
      try {
        fetch('http://localhost:8000/e-2market/v1/users/updateDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, fullname}),
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Details changed successful');
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
          Update Details
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
              id="old"
              placeholder="Enter Username"
              name="uname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="psw"
              className="block text-sm font-medium text-gray-700"
            >
                Email
            </label>
            <input
              type="text"
              id="new email"
              placeholder="Enter Email"
              name="psw"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="pswc"
              className="block text-sm font-medium text-gray-700"
            >
                Full Name
            </label>
            <input
              type="text"
              id="fullname"
              placeholder="Enter fullname"
              name="pswc"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Udate Details
          </button>
        </form>

        
      </div>

      
    </div>
  );
}

export default  ChangePassword;
