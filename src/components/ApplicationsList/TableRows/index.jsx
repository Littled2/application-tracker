import { getDate } from "../../../helpers/dates"
import styles from "./styles.module.css"

export function TableRows({ items, setOpenAppID, showType=true, showDeadline=false, showDeadlineType=false }) {
    return (
        <>
            {
                items.map((item, i) => {
                    return (
                        <tr key={i}>
                            <td className={styles.org}>{item?.expand?.organisation?.name}</td>
                            <td className="cursor-pointer" onClick={() => setOpenAppID(item.id)}>{item?.role}</td>
                            {
                                showType ? (
                                    <td>
                                        {
                                            item?.type ? (
                                                item.type.substring(0, 1).toUpperCase()
                                            ) : (
                                                <>-</>
                                            )
                                        }
                                    </td>
                                ) : (
                                    <></>
                                )
                            }
                            {
                                showDeadline ? (
                                    <td className={styles.dln}>
                                        {
                                            item?.deadline ? (
                                                getDate(item?.deadline)
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </td>
                                ) : (
                                    <></>
                                )
                            }
                            {
                                showDeadlineType ? (
                                    <td>
                                        {/* {
                                            item?.deadlineType ? (
                                                item.deadlineType  === "fixed" ? (
                                                    "F"
                                                ) : (
                                                    "R"
                                                )
                                            ) : (
                                                <></>
                                            )
                                        } */}
                                        {
                                            item?.deadlineType.substring(0, 1).toUpperCase()
                                        }
                                    </td>
                                ) : (
                                    <></>
                                )
                            }
                        </tr>
                    )
                })   
            }
        </>
    )
}