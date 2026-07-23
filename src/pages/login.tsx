import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify' 

export function Login_page({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const navigate = useNavigate()
    const login_form = {email : "", password : ""}
    const [login_data, set_login_data] = useState(login_form)

    async function Login() {
        const response = await fetch("http://localhost:8000/login", {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(login_data)
        })
        if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.access_token)
            toast.success("Η σύνδεση ολοκληρώθηκε με επιτυχία!")
            onLoginSuccess()
            navigate("/todos")
        }
        else {
            const data = await response.json()
            const errorMsg = data.detail?.[0]?.msg || data.detail
            toast.error(`Σφάλμα κατά την σύνδεση: ${errorMsg}`)
        }
    }
    return (
        <div className="login-container">
            <h2>Σύνδεση</h2>
            <input
                type="email"
                placeholder="Email"
                value={login_data.email}
                onChange={(e) => set_login_data({...login_data, email: e.target.value})}
            />
            <input
                type="password"
                placeholder="Password"
                value={login_data.password}
                onChange={(e) => set_login_data({...login_data, password: e.target.value})}
            />
            <button onClick={Login}>Σύνδεση</button>
            <p>
                Δεν έχετε λογαριασμό? <Link to="/register">Εγγραφείτε εδώ</Link>
            </p>
        </div>
    )
}