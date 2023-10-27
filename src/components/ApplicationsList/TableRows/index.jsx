import styles from "./styles.module.css"

export function TableRows({ items, setOpenAppID, showType=true, showDeadline=false, showDeadlineType=false }) {
    return (
        <>
            {
                items.map((item, i) => {
                    return (
                        <tr key={i}>
                            <td className={styles.org}>{item?.org?.name}</td>
                            <td className="cursor-pointer" onClick={() => setOpenAppID(item.id)}>{item?.name}</td>
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
                                    <td className={styles.dln}>{item?.deadline}</td>
                                ) : (
                                    <></>
                                )
                            }
                            {
                                showDeadlineType ? (
                                    <td>
                                        {
                                            item?.deadlineType ? (
                                                item.deadlineType  === "fixed" ? (
                                                    "F"
                                                ) : (
                                                    "R"
                                                )
                                            ) : (
                                                <></>
                                            )
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