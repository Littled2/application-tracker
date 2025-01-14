import { useEffect, useRef, useState } from "react"
import styles from "./styles.module.css"
import { useMobile } from "../../contexts/mobileContext"

export function Tabs({ tabs, saveActiveTabAs=null }) {

    const [ selected, setSelected ] = useState(() => {
        if(saveActiveTabAs !== null) {
            let saved = localStorage.getItem(saveActiveTabAs)
            if(!saved) {
                return 0
            } else {
                return JSON.parse(saved)
            }
        }
    })

    const { isMobile } = useMobile()

    useEffect(() => {
        if(saveActiveTabAs) {
            localStorage.setItem(saveActiveTabAs, selected)
        }
    }, [ selected ])


    return (
        <div>
            <div className={styles.tabs}>
                {
                    tabs.filter(tab => !(isMobile && tab.hideOnMobile === true)).map((tab, i) => {
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
                    tabs.filter(tab => !(isMobile && tab.hideOnMobile === true))[selected].tab
                }
            </div>
        </div>
    )
}