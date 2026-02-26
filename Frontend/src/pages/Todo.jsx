import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit3, Check, X } from "lucide-react";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: token }
  });

  // fetch todos
  const fetchTodos = async () => {
    const res = await api.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // add todo
  const addTodo = async () => {
    if (!title.trim()) return;
    await api.post("/todos", { title });
    setTitle("");
    fetchTodos();
  };

  // delete todo
  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  // update todo
  const updateTodo = async (id) => {
    if (!editingTitle.trim()) return;
    await api.put(`/todos/${id}`, { title: editingTitle });
    setEditingId(null);
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          📝 My Todo List
        </h1>

        {/* Add Todo */}
        <div className="flex mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add new task..."
            className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-4 rounded-r hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
            >
              {editingId === todo.id ? (
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 mr-2 border px-2 py-1 rounded"
                />
              ) : (
                <span className="flex-1 text-gray-800">
                  {todo.title}
                </span>
              )}

              <div className="flex gap-2">
                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={() => updateTodo(todo.id)}
                      className="text-green-600"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditingTitle(todo.title);
                      }}
                      className="text-blue-600"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No todos yet 🚀
          </p>
        )}
      </div>
    </div>
  );
}