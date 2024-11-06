import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Input from './Input';
import {TbPointFilled} from 'react-icons/tb'
import { useSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';
import { FaUserNinja } from 'react-icons/fa';



const Todo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTodo, setNewTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const {enqueueSnackbar} = useSnackbar()
    const [username, setUsername] = useState('')
    const [moveNinja, setMoveNinja] = useState(false)

    const fetchUsername = ()=>{
        try{
            const token = localStorage.getItem("token")
            const user = jwtDecode(token)
            setUsername(user.username)
        }catch(err){
            setError(err.message)
        }
    }

useEffect(()=>{
    fetchUsername()
},[])


    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('https://bolt-list-server.vercel.app/todo/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                setTodos(response.data.todos);
            } else {
                setError("Failed to fetch todos.");
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
            const token = localStorage.getItem("token");
            const postTodo = await axios.post('https://bolt-list-server.vercel.app/todo/', { title: newTodo, completed: false }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (postTodo.status === 200) {
                enqueueSnackbar("Yeah! New activity is added!",{variant: 'success'})
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
            const markedCompleted = await axios.put(`https://bolt-list-server.vercel.app/todo/${id}`, { completed: true }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (markedCompleted.status === 200) {
                alert("Todo marked as completed!");
                fetchTodos();
                enqueueSnackbar("Todo marked as completed",{variant:'success'})
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        window.location.href = 'https://bolt-list.vercel.app';
    };


    return (
        <div className="grid grid-cols-5   font-mono min-h-screen">
            <div className="col-span-2 relative flex flex-col items-center bg-darkBg h-screen">
                <div
                    onMouseEnter={() => setMoveNinja(true)}
                    onMouseLeave={() => setMoveNinja(false)}
                    className="bg-darkPrimary absolute top-60 md:top-64 lg:top-72  p-4 text-xl md:text-2xl rounded-xl hover:bg-gradient-to-tr hover:from-blue-300 hover:to-pink-300 transition-transform duration-500"
                >
                <FaUserNinja className={`${moveNinja ? "translate-x-16" : "translate-x-0"} transition-transform duration-300`} />
                    {username}
                </div>
                <div className="text-orange-300  absolute top-20 text-[4rem] md:text-[6rem] lg:text-[] ">📝</div>
            </div>

            <div className="col-span-3  relative flex flex-col items-center bg-lightBorderColor h-screen lg:w-full">
                <div className="flex justify-end w-full mt-4">
                    <button
                        onClick={()=>{
                            enqueueSnackbar("Logged out successfully!",{variant: 'success'})
                            handleLogout()
                            }}
                        className="border-2 absolute right-4 px-4 py-2 text-lightPrimary border-gray-400 hover:bg-lightPrimary hover:text-lightBorderColor transition-all duration-300 rounded-xl"
                    >
                        Logout
                    </button>
                </div>

                <form onSubmit={handleTodoSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm mt-10">
                    <Input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Enter new todo..."
                        required
                    />
                    <button
                        type="submit"
                        className="sm:w-[14rem] lg:w-full w-[8rem] border-2 px-4 py-2  text-lightPrimary border-gray-400 hover:bg-lightPrimary hover:text-lightBorderColor transition-all duration-500 rounded-xl"
                    >
                        Add Todo
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                <div className="w-full max-w-sm mt-6 ">
                    {loading ? (
                        <div className="text-center text-black hover:text-darkPrimary">Loading...</div>
                    ) : (
                        <div className="flex flex-col gap-2">
                        {todos && todos.length > 0 ? (
                            todos.map((todo) => (
                            <div
                                key={todo?._id}
                                className="cursor-pointer border-2 text-center border-gray-400 text-black hover:bg-lightPrimary hover:text-darkPrimary transition-all duration-300 rounded-xl w-[16em] translate-x-3 sm:translate-x-0 sm:w-full p-2"
                                onClick={() => handleCompletedStatus(todo?._id)}
                            >
                                <div className="flex items-center justify-start gap-2">
                                <TbPointFilled />
                                <p
                                    className={`text-lg ${todo.completed ? "line-through text-gray-500" : "text-gray-800"} hover:text-darkPrimary`}
                                >
                                     {todo?.title}
                                </p>
                                </div>
                            </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No todos available</p>
                        )}
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default Todo;
