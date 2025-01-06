import { useCallback, useEffect, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { BiFile, BiFileBlank, BiTrash } from "react-icons/bi"
import { Popup } from "../../../components/Popup"
import styles from "./styles.module.css"
import { Confirm } from "../../../components/forms/Confirm"

export function DocumentUploadDownload({ application, fileKeyName }) {

    const { pb } = usePocket()

    const [ fileToken, setFileToken ] = useState()

    const [ uploading, setUploading ] = useState(false)
    const [ error, setError ] = useState()

    const [ confirmDelete, setConfirmDelete ] = useState(false)


    useEffect(() => {
        (async () => {
            const token = await pb.files.getToken()
            setFileToken(token)
        })()
    }, [])

    const uploadFile = useCallback((file) => {

        if(!file) return

        setUploading(true)
        setError(null)

        // Upload the file

        const fd = new FormData()
        fd.append(fileKeyName, file)

        pb.collection("applications").update(application.id, fd)
        .then(() => setUploading(false))
        .catch((err) => {
            console.error("Error uploading file", err)
            setUploading(false)
            setError(true)
        })

    }, [ pb, application ])

    const deleteFile = useCallback((file) => {

        if(!file) return

        setError(null)

        pb.collection("applications").update(application.id, {
            [fileKeyName]: ''
        })
        .then(() => {})
        .catch((err) => {
            console.error("Error uploading file", err)
            setError(true)
        })

    }, [ pb, application ])

    return (
        <>
            <small className="flex gap-s">
                {
                    fileToken ? (
                        <>
                            {
                                application[fileKeyName] ? (
                                    <>
                                        <a href={pb.files.getUrl(application, application[fileKeyName], { token: fileToken })} className={styles.file} download>
                                            <BiFileBlank style={{ fontSize: "1.2rem" }} />
                                            {application[fileKeyName].split('_').slice(0, -1).join('_')}
                                        </a>
                                        <span className="text-white"> | </span>
                                    </>
                                ) : (
                                    <></>
                                )
                            }

                            {
                                !application[fileKeyName] ? (
                                    !uploading ? (
                                        <label className="underline cursor-pointer">
                                            Upload
                                            <input style={{ display:"none" }} hidden type="file"  onChange={e => uploadFile(e.target.files[0])}/>    
                                        </label>
                                    ) : (
                                        <small>Uploading...</small>
                                    )
                                ) : (
                                    <span style={{ fontSize: "1.2rem" }} className={styles.bin} onClick={() => setConfirmDelete(true)}><BiTrash/></span>
                                )
                            }

                            {
                                error ? (
                                    <span style={{ color:"red" }}>Error</span>
                                ) : (
                                    <></>
                                )
                            }

                            {/* <a href={pb.files.getUrl(application, application[fileKeyName], { token: fileToken })} className="underline cursor-pointer" download>Upload</a> */}
                        </>
                    ) : (
                        <></>
                    )
                }
            </small>

            <Confirm
                trigger={confirmDelete}
                setTrigger={setConfirmDelete}
                message={"Are you sure you want to delete this file?"}
                onConfirm={deleteFile}
            ></Confirm>
        </>
    )
}