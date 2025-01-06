import { Tabs } from "../../components/Tabs"
import { CreateAccount } from "../../components/forms/CreateAccount"
import { Login } from "../../components/forms/Login"
import styles from "./styles.module.css"


export function AuthenticationWrapper() {
    return(
        <div className={styles.wrapper}>

            <img className={styles.logo} src="/exeter application tracker logo.png" />

            <Tabs tabs={[
                {
                    name: "Login",
                    tab: (
                        <div className={styles.tab}>
                            <h3>Login to the application tracker</h3>

                            <Login />
                        </div>
                    )
                },
                {
                    name: "Create Account",
                    tab: (
                        <div className={styles.tab}>
                            <h3>Create an account to use the application tracker</h3>

                            <CreateAccount />
                        </div>
                    )
                }

            ]} />
        </div>
    )
}