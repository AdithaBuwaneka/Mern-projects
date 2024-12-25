import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

function Todolist() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(null); // For handling task editing

  useEffect(() => {
    // Fetch tasks when the component mounts
    axios.get(API_URL).then((res) => setTasks(res.data));
  }, []);

  const addTask = async () => {
    if (title.trim()) {
      // Add a new task to the database
      const res = await axios.post(API_URL, { title });
      setTasks([...tasks, res.data]);
      setTitle("");
    }
  };

  const deleteTask = async (id) => {
    // Delete task from the database
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const startEditing = (task) => {
    // Start editing a task
    setEditing(task);
    setTitle(task.title);
  };

  const updateTask = async () => {
    if (editing && title.trim()) {
      // Update task with a PUT request
      const res = await axios.put(`${API_URL}/${editing._id}`, { title });
      setTasks(tasks.map((task) => (task._id === res.data._id ? res.data : task)));
      setEditing(null);
      setTitle("");
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((task) => task._id === id);
    // Toggle the completed status of the task
    const updatedTask = await axios.put(`${API_URL}/${id}`, {
      completed: !task.completed,
    });
    setTasks(
      tasks.map((task) =>
        task._id === updatedTask.data._id ? updatedTask.data : task
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">To-Do List</h1>

      {/* Input for adding or editing tasks */}
      <div className="flex space-x-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={editing ? updateTask : addTask}
          className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editing ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Task</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Completed</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-700">{task.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {task.completed ? (
                    <span className="text-green-500">Yes</span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => toggleComplete(task._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                  >
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button
                    onClick={() => startEditing(task)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Todolist;
