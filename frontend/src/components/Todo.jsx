import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported

const Todo = () => {
    const [loading, setLoading] = useState(false); // Changed to boolean
    const [error, setError] = useState(null); // Initialize as null
    const [newTodo, setNewTodo] = useState("");
    const [todos, setTodos] = useState([]);

    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get('http://localhost:3000/todo/',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                setTodos(response.data.todos);
                console.log(response.data.todos)
            } else {
                setError("Response.data failed");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleTodoSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token")
            const postTodo = await axios.post('http://localhost:3000/todo/', { title: newTodo, completed: false },{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if (postTodo.status === 200) {
                alert("Todo posted successfully!");
                setNewTodo("");
                fetchTodos();
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCompletedStatus = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const markedCompleted = await axios.put(`http://localhost:3000/todo/${id}`, {completed:true}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (markedCompleted.status === 200) {
                alert("Todo marked as completed!");
                fetchTodos();
            }
        } catch (error) {
            setError(error.message);
        }
    };
    const handleLogout = async()=>{
        localStorage.removeItem("token")
        window.location.href='http://localhost:5173'
    }

    return (
        <div>
        <div>
            <form onSubmit={handleTodoSubmit}>
                <label htmlFor="New Todo">New Todo: </label>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder='Enter new todo...'
                    required
                />
                <button type='submit'>Add Todo</button>
            </form>
            <div className='user-detail'>
                <button onClick={handleLogout}>Logout</button>
            </div>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div>
                {loading ? <div>Loading...</div> :
                    <div>
                        {todos && todos.length > 0 && todos.map((todo) => (
                            <div key={todo?._id}>
                                <p style={{
                                    textDecoration: todo.completed ? "line-through" : 'none'
                                }} onClick={() => handleCompletedStatus(todo?._id)}>
                                    {todo?.title}
                                </p>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
};

export default Todo;
