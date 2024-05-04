import { useCallback, useState } from "react"
import styles from "./styles.module.css"
import { usePocket } from "../../../contexts/pocketContext"

export function Login() {

    const { login } = usePocket()

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const submit = useCallback((e) => {
        e.preventDefault()
        login(email, password)
        .then(res => {
            console.log(res)
            
        })
        .catch(err => {
            console.error("Error login in", err)
        })
    }, [email, password])

    return (
        <div className={styles.wrapper}>

            <h3>Login</h3>

            <form className={`form ${styles.form}`} onSubmit={submit}>

                <div>
                    <div>
                        <label>Email</label>
                    </div>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="text" required />
                </div>

                <div>
                    <div>
                        <label>Password</label>
                    </div>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
                </div>

                <div>
                    <button type="submit">Login</button>
                </div>

            </form>
        </div>
    )
}