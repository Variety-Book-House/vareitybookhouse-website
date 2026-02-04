import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginForm />
        </Suspense>
    )
}

function LoginLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            Loading…
        </div>
    )
}
