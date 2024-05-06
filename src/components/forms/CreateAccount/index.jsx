import { useCallback, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import styles from "./styles.module.css"


export function CreateAccount() {

    const { register } = usePocket()

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ passwordConfirm, setPasswordConfirm ] = useState('')
    const [ name, setName ] = useState('')

    const [ err, setErr ] = useState()


    const submit = useCallback((e) => {
        e.preventDefault()

        setErr(true)

        register(email, password, passwordConfirm)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.error("Error login in", err)
            setErr(true)
        })
    }, [email, password, passwordConfirm, name, err])

    return (
        <form className={`form ${styles.form}`} onSubmit={submit}>

            <div>
                <div>
                    <label>Email</label>
                </div>
                <input name="create-account-email" id="create-account-email" style={{ width: "100%" }} value={email} onChange={e => setEmail(e.target.value)} type="text" required />
            </div>

            <div>
                <div>
                    <label>Password</label>
                </div>
                <input name="create-account-password" id="create-account-password" style={{ width: "100%" }} value={password} onChange={e => setPassword(e.target.value)} type="password" required />
            </div>

            <div>
                <div>
                    <label>Confirm password</label>
                </div>
                <input name="create-account-password-confirm" id="create-account-password-confirm" style={{ width: "100%" }} value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} type="password" required />
            </div>

            {
                err ? (
                    <p>Something went wrong!</p>
                ) : (
                    <></>
                )
            }

            <div>
                <button type="submit">Create Account</button>
            </div>

        </form>
    )
}