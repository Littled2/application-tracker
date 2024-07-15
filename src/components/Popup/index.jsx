import { useCallback, useEffect } from "react"
import styles from "./styles.module.css"
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai"

export function Popup({ title, children, trigger, setTrigger, onDelete }) {

    const handleKeyPress = useCallback(e => {
        if(e.key === "Escape") {
            setTrigger(false)
        }
    }, [])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])

    return trigger ? (
        <div className={styles.wrapper}>
            <div className={styles.popup}>

                <div className={styles.top}>
                    <p>{title}</p>

                    <div className="flex gap-s">
                        {
                            onDelete && (
                                <button onClick={onDelete}>
                                    <AiOutlineDelete />
                                </button>
                            )
                        }
                        <button onClick={() => setTrigger(false)}>
                            <AiOutlineClose />
                        </button>
                    </div>
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