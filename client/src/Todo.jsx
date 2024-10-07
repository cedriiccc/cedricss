export default function Todo(props) {
    const updateTodo = async (todoId, todoStatus) => {
        try {
            const res = await fetch(`/api/todos/${todoId}`, {
                method: "PUT",
                body: JSON.stringify({ status: todoStatus }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error('Failed to update todo');

            const json = await res.json();

            if (json.acknowledged) {
                props.setTodos(currentTodos => {
                    return currentTodos.map(currentTodo => {
                        if (currentTodo._id === todoId) {
                            return { ...currentTodo, status: !currentTodo.status };
                        }
                        return currentTodo;
                    });
                });
            }
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const deleteTodo = async (todoId) => {
        try {
            const res = await fetch(`/api/todos/${todoId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error('Failed to delete todo');

            const json = await res.json();

            if (json.acknowledged) {
                props.setTodos(currentTodos => {
                    return currentTodos.filter(currentTodo => currentTodo._id !== todoId);
                });
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    return (
        <div className="todo">
            <p>{props.todo.todo}</p>
            <div className="mutations">
                <button
                    className="todo__status"
                    onClick={() => updateTodo(props.todo._id, props.todo.status)}
                >
                    {props.todo.status ? "☑" : "☐"}
                </button>
                <button
                    className="todo__delete"
                    onClick={() => deleteTodo(props.todo._id)}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}
