import styles from "./styles.module.css"
import { AiOutlineClose } from "react-icons/ai"

export function Popup({ title, children, trigger, setTrigger }) {
    return trigger ? (
        <div className={styles.wrapper}>
            <div className={styles.popup}>

                <div className={styles.top}>
                    <p>{title}</p>
                    <button onClick={() => setTrigger(false)}>
                        <AiOutlineClose />
                    </button>
                </div>

                <div className={styles.content}>
                    {children}
                </div>

            </div>
        </div>
    ) : (
        <></>
    )
}