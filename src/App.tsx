import { useState, useEffect} from 'react'
import './App.css'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { Register_page } from './pages/register'
import { Login_page } from './pages/login'
import { GetTodos_page } from './pages/todos'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [logged_in, set_logged_in] = useState(false)
  const navigate = useNavigate()

  
  function Logout() {
    localStorage.removeItem("token")
    set_logged_in(false)
    navigate("/login")
  }

  useEffect(() => {
    async function checkToken() {
      const token = localStorage.getItem("token")
    
      // Αν δεν υπάρχει καν token, σταματάμε εδώ
      if (!token) {
        set_logged_in(false)
        return
      }

      // Στέλνουμε αίτημα στο backend για να δούμε αν το token είναι ακόμα έγκυρο
      try {
        const response = await fetch("http://localhost:8000/todos", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

      if (response.ok) {
        // Το token ΙΣΧΥΕΙ ακόμα!
        set_logged_in(true)
        navigate("/todos")
      } else {
        // Το token ΕΛΗΞΕ ή είναι άκυρο! Καθαρίζουμε το localStorage
        localStorage.removeItem("token")
        set_logged_in(false)
        navigate("/login")
      }
    }catch (error) {
      // Αν έπεσε ο server ή υπήρξε σφάλμα δικτύου
      localStorage.removeItem("token")
      set_logged_in(false)
    }
  }

  checkToken()
  }, [])



  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        {!logged_in ? (
          <>
            <Link to="/login">Σύνδεση</Link>
            <Link to="/register">Εγγραφή</Link>
          </>
        ) : (
          <button onClick={Logout}>Αποσύνδεση</button>
        )}
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to={logged_in ? "/todos" : "/login"} />} />
        <Route path="/register" element={<Register_page />} />
        <Route path="/login" element={<Login_page onLoginSuccess={() => set_logged_in(true)} />} />
        
        {/* Προστατευμένο Route: Αν δεν είναι logged_in, τον στέλνει στο Login */}
        <Route 
          path="/todos" 
          element={logged_in ? <GetTodos_page /> : <Navigate to="/login" />} 
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}