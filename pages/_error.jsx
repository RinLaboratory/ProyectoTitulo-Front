const { useRouter } = require("next/router");

export default function ErrorPage() {
    const router = useRouter()
    router.push('/')

}