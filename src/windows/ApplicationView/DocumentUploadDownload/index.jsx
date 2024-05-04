import { useCallback, useEffect, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function DocumentUploadDownload({ application, fileKeyName }) {

    const { pb } = usePocket()

    const [ fileToken, setFileToken ] = useState()

    const [ uploading, setUploading ] = useState(false)
    const [ error, setError ] = useState()


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

    return (
        <small>
            {
                fileToken ? (
                    <>
                        {
                            application[fileKeyName] ? (
                                <>
                                    <a href={pb.files.getUrl(application, application[fileKeyName], { token: fileToken })} className="underline cursor-pointer" download>Download</a>
                                    <span className="text-white"> | </span>
                                </>
                            ) : (
                                <></>
                            )
                        }

                        {
                            !uploading ? (
                                <label className="underline cursor-pointer">
                                    Upload
                                    <input style={{ display:"none" }} hidden type="file"  onChange={e => uploadFile(e.target.files[0])}/>    
                                </label>
                            ) : (
                                <small>Uploading...</small>
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
    )
}