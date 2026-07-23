import { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';


type Todo = {
    id: number,
    title: string,
    description: string,
    completed : boolean
  }

type TodoUpdate = {
  title: string
  description: string
  completed: boolean
}

export function GetTodos_page() {
    const navigate = useNavigate()
    const [todos, setTodos] = useState<Todo[]>([])
    const [todo_data, set_todo_data] = useState({ title: "", description: "" })
    const [update_data, set_update_data] = useState<TodoUpdate | null>(null)

    async function fetchTodos() {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Δεν έχετε συνδεθεί. Παρακαλώ συνδεθείτε πρώτα.")
            navigate("/login")
            return
        }
        const response = await fetch("http://localhost:8000/todos", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.ok) {
            const data = await response.json()
            setTodos(data)
        }
        else {
            const data = await response.json()
            toast.error(`Σφάλμα κατά την ανάκτηση των todos: ${data.detail}`)
        }
    }

    async function createTodo() {
        if (!todo_data.title.trim()) {
            toast.error("Σφάλμα: Ο τίτλος είναι υποχρεωτικός!");
            return
        }
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Δεν έχετε συνδεθεί. Παρακαλώ συνδεθείτε πρώτα.");
            navigate("/login")
            return
        }
        const response = await fetch("http://localhost:8000/create_todo", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: todo_data.title.trim(), description: todo_data.description })
        })
        if (response.ok) {
            toast.success("Το todo δημιουργήθηκε με επιτυχία!")
            await fetchTodos()  
        }
        else {
            const data = await response.json()
            toast.error(`Σφάλμα κατά τη δημιουργία του todo: ${data.detail}`)
        }
    }

    async function updateTodo(id: number) {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Δεν έχετε συνδεθεί. Παρακαλώ συνδεθείτε πρώτα.")
            navigate("/login")
            return
        }
        const response = await fetch(`http://localhost:8000/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(update_data)
        })
        if (response.ok) {
            toast.success("Το todo ενημερώθηκε με επιτυχία!")
            set_update_data(null)
            await fetchTodos()
        }
        else {
            const data = await response.json()
            toast.error(`Σφάλμα κατά την ενημέρωση του todo: ${data.detail}`)
        }
    }
    async function deleteTodo(id: number) {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Δεν έχετε συνδεθεί. Παρακαλώ συνδεθείτε πρώτα.")
            navigate("/login")
            return
        }
        const response = await fetch(`http://localhost:8000/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.ok) {
            toast.success("Το todo διαγράφηκε με επιτυχία!")
            await fetchTodos()  
        }
        else {
            const data = await response.json()
            toast.error(`Σφάλμα κατά τη διαγραφή του todo: ${data.detail}`)
        }
    }

    return (
        <div className="todos-container">
            <h2>Σημειώσεις</h2>
            {/* Φόρμα δημιουργίας νέου todo */}
            <div className="create-todo-form">
                <h3>Δημιουργία Σημείωσης</h3>
                <input
                    type="text"
                    placeholder="Τίτλος"
                    value={todo_data.title}
                    onChange={(e) => set_todo_data({ ...todo_data, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Περιγραφή"
                    value={todo_data.description}
                    onChange={(e) => set_todo_data({ ...todo_data, description: e.target.value })}
                />
                <button onClick={createTodo}>Δημιουργία</button>
            </div>
            <hr style={{ margin: "20px 0" }} />
            {/* Λίστα Todos */}
            <div className="todos-list">
                {todos.length === 0 ? (
                    <p>Δεν υπάρχουν διαθέσιμες σημειώσεις.</p>
                ) : (
                    todos.map((todo: Todo) => (
                        <div key={todo.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }} >
                            <h3>{todo.title}</h3>
                            <p>{todo.description}</p>
                            <p>Ολοκληρωμένο: {todo.completed ? "Ναι" : "Όχι"}</p>
                            <button onClick = {() => set_update_data({ title: todo.title, description: todo.description, completed: todo.completed })}>Ενημέρωση</button>
                            <button onClick={() => deleteTodo(todo.id)}>Διαγραφή</button>
                            {/* Φόρμα ενημέρωσης todo */}
                            {update_data && (
                                <div className="update-todo-form">
                                    <h3>Ενημέρωση Todo</h3>
                                    <input
                                        type="text"
                                        placeholder="Τίτλος"
                                        value={update_data.title}
                                        onChange={(e) => set_update_data({ ...update_data, title: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Περιγραφή"
                                        value={update_data.description}
                                        onChange={(e) => set_update_data({ ...update_data, description: e.target.value })}
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={update_data.completed}
                                            onChange={(e) => set_update_data({ ...update_data, completed: e.target.checked })}
                                        />
                                        Ολοκληρωμένο
                                    </label>
                                    <button onClick={() => updateTodo(todo.id)}>Αποθήκευση</button>
                                    <button onClick={() => set_update_data(null)}>Ακύρωση</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}