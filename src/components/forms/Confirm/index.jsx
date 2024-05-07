import { Popup } from "../../Popup";
import styles from "./styles.module.css"

export function Confirm({ message, trigger, setTrigger, onConfirm }) {

    const confirm = () => {
        if(onConfirm) {
            onConfirm()
        }

        setTrigger(false)
    }

    return (
        <Popup trigger={trigger} setTrigger={setTrigger} title={"Confirm"}>
            <p className="accent" style={{ textAlign: "left" }}>{message}</p>
            <div className={styles.buttons}>
                <button style={{ backgroundColor: "var(--light-grey)", color: "white" }} onClick={() => setTrigger(false)}>Cancel</button>
                <button onClick={confirm}>Confirm</button>
            </div>
        </Popup>
    )
}