import { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) throw new Error('Failed to fetch todos');
        const todos = await res.json();
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      try {
        const res = await fetch("/api/todos", {
          method: "POST",
          body: JSON.stringify({ todo: content }),  
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error('Failed to create todo');
        
        const newTodo = await res.json();
        setContent("");
        setTodos(prevTodos => [...prevTodos, newTodo]); // Use functional update
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  };

  return (
    <main className="container">
      <h1 className="title">Awesome Todos</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input 
          type="text" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Enter a new todo..."
          className="form__input"
          required 
        />
        <button type="submit">Create Todo</button>
      </form>
      <div className="todos">
        {todos.length > 0 && 
          todos.map((todo) => (
            <Todo todo={todo} setTodos={setTodos} key={todo._id} />
          ))
        }
      </div>
    </main>
  );
}
