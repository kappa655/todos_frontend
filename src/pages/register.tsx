import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify';

export function Register_page() {
    const navigate = useNavigate()
    const reg_form = {username : "", password : "", email : ""}
    const [reg_data, set_reg_data] = useState(reg_form) 

    async function Register() {
        const response = await fetch("http://localhost:8000/register", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(reg_data)
        })
        if (response.ok) {  
            toast.success("Η εγγραφή ολοκληρώθηκε με επιτυχία! Μπορείτε να συνδεθείτε τώρα.")
            navigate("/login")
        }
        else {
            const data = await response.json()
            const errorMsg = data.detail?.[0]?.msg || data.detail
            toast.error(`Σφάλμα κατά την εγγραφή: ${errorMsg}`)
        }
    }

    return (
        <div className="register-container">
            <h2>Εγγραφή</h2>
            <input
                type="text"
                placeholder="Όνομα χρήστη"
                value={reg_data.username}
                onChange={(e) => set_reg_data({...reg_data, username: e.target.value})}
            />
            <input
                type="email"
                placeholder="Email"
                value={reg_data.email}
                onChange={(e) => set_reg_data({...reg_data, email: e.target.value})}
            />
            <input
                type="password"
                placeholder="Κωδικός"
                value={reg_data.password}
                onChange={(e) => set_reg_data({...reg_data, password: e.target.value})}
            />
            <button onClick={Register}>Εγγραφή</button>
            <p>
               Έχετε ήδη λογαριασμό? <Link to="/login">Συνδεθείτε εδώ</Link>
            </p>
        </div>
    )
}