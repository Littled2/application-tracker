import { useCallback, useState } from "react"
import styles from "./styles.module.css"
import { usePocket } from "../../../contexts/pocketContext"

export function Login() {

    const { login } = usePocket()

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ processing, setProcessing ] = useState(false)

    const [ err, setErr ] = useState()
    const [ incorrect, setIncorrect ] = useState()

    const submit = useCallback((e) => {
        e.preventDefault()

        setErr(false)
        setIncorrect(false)

        setProcessing(true)

        login(email, password)
        .then(res => {
            console.log(res)
            
        })
        .catch(err => {
            if(err?.response?.message === "Failed to authenticate.") {
                setIncorrect(true)
                setProcessing(false)
            } else {
                setErr(true)
                setProcessing(false)
            }
        })
    }, [email, password, err])

    return (
        <form className={`form ${styles.form}`} onSubmit={submit}>

            <div>
                <div>
                    <label>Email</label>
                </div>
                <input style={{ width: "100%" }} value={email} onChange={e => setEmail(e.target.value)} type="text" required />
            </div>

            <div>
                <div>
                    <label>Password</label>
                </div>
                <input style={{ width: "100%" }} value={password} onChange={e => setPassword(e.target.value)} type="password" required />
            </div>

            {
                err ? (
                    <p>Something went wrong!</p>
                ) : (
                    <></>
                )
            }

            {
                incorrect ? (
                    <p>Incorrect login details</p>
                ) : (
                    <></>
                )
            }

            <div>
                <button type="submit">
                    {
                        !processing ? (
                            "Login"
                        ) : (
                            "Processing..."
                        )
                    }
                </button>
            </div>

        </form>
    )
}