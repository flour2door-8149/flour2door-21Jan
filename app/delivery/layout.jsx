import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs"

export const metadata = {
    title: "Flour2Door - Delivery Dashboard",
    description: "Manage your deliveries",
}

export default function DeliveryLayout({ children }) {
    return (
        <>
            <SignedIn>
                {children}
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/delivery" routing="hash" />
                </div>
            </SignedOut>
        </>
    )
}