import { useRouter } from "next/router"
import { useEffect } from "react"

const RedirectToGHA = () => {
    const router = useRouter()

    useEffect(() => {
        const owner = router.query.owner as string
        const repo = router.query.repo as string

        if (owner && repo) {
            router.push(`/gha/${owner}/${repo}`)
        }
    })

    return (<></>)
}

export default RedirectToGHA
