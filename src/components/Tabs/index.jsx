import { useState } from "react"
import styles from "./styles.module.css"

export function Tabs({ tabs }) {

    const [ selected, setSelected ] = useState(0)

    return (
        <div>
            <div className={styles.tabs}>
                {
                    tabs.map((tab, i) => {
                        return (
                            <button key={i} className={[ styles.tab, selected === i ? styles.selected : ''].join(' ')} onClick={() => setSelected(i)}>
                                {
                                    tab.name
                                }
                            </button>
                        )
                    })
                }
            </div>
            <div>
                {
                    tabs[selected].tab
                }
            </div>
        </div>
    )
}