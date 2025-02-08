import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Todolist() {
const [username, setUsername] = useState("");

  useEffect(() => {
    fetch(
      "http://localhost:8000/anuragnidhi-tdl/2005/v1/tdl/todolist-details",
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
        setUsername(String(data.username).toUpperCase());
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, []);

  const logout = () => {
    fetch("http://localhost:8000/anuragnidhi-tdl/2005/v1/users/logout", {
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

  const [content, setcontent] = useState("");
  const adddata = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/anuragnidhi-tdl/2005/v1/tdl/todolist", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          window.location.href = "/login";
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          // alert("Task added successfully");
          // window.location.reload();
          setcontent("");
          fetchtodos();
        } else {
          alert("Task addition failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };
  useEffect(() => {
    fetchtodos();
  }, []);
  const [todos, setTodos] = useState([]);
  const fetchtodos = () => {
    fetch("http://localhost:8000/anuragnidhi-tdl/2005/v1/tdl/objectives", {
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
        setTodos(data.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const deleteTodo = (id) => {
    fetch("http://localhost:8000/anuragnidhi-tdl/2005/v1/tdl/delete-todo", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todoId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // alert("Task deleted successfully");
          fetchtodos();
        } else {
          alert("Task deletion failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const toggleTodoCompletion = (id, completed) => {
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    fetch("http://localhost:8000/anuragnidhi-tdl/2005/v1/tdl/update-todo", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todoId: id, completed: !completed }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          alert("Failed to update task completion status.");
        }
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  return (
    <div className="p-4 bg-slate-800 min-h-screen">
      <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white flex items-center justify-between mb-4 rounded-md shadow-lg">
        <h1 className="text-5xl font-extrabold tracking-wide">{username}</h1>
        <div id="buttons" className="flex space-x-4">
          <button
            id="logout"
            onClick={logout}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-5 rounded-md hover:bg-gradient-to-r hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg"
          >
            Log out
          </button>
          <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-5 rounded-md hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg">
            <Link to="/Change-password">Change-password</Link>
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-5 rounded-md hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg">
            <Link to="/Change-details">Change-details</Link>
          </button>
        </div>
      </nav>

      <form
        id="list"
        onSubmit={adddata}
        className="flex items-center space-x-4 p-4 bg-white rounded-md shadow-lg"
      >
        <input
          type="text"
          id="input"
          name="input"
          value={content}
          onChange={(e) => setcontent(e.target.value)}
          placeholder="Enter your task here"
          required
          className="flex-1 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-lg transition-all duration-300"
        />
        <button
          id="add"
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-5 rounded-md hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-lg transition-all duration-300"
        >
          Add
        </button>
      </form>

      <div id="task-list" className="p-4">
        <ul id="tasks" className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo._id}
              id="option"
              className="flex items-center justify-between bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-md shadow-md hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`todo-${todo._id}`}
                  checked={todo.completed || false}
                  onChange={() =>
                    toggleTodoCompletion(todo._id, todo.completed)
                  }
                  className="w-6 h-6 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                <label
                  htmlFor={`todo-${todo._id}`}
                  id="data"
                  className={`flex-1 text-lg text-gray-800 ${
                    todo.completed ? "line-through text-gray-600" : ""
                  } transition-all duration-300`}
                >
                  {todo.content}
                </label>
              </div>

              <button
                id="del"
                onClick={() => deleteTodo(todo._id)}
                className="text-red-600 hover:text-red-800 focus:outline-none border-2 border-red-600 px-4 py-2 rounded-md hover:bg-red-100 focus:ring-2 focus:ring-red-600 shadow-lg transition-all duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todolist;
