import { Button } from "@/components/ui/button"

import { useShallow } from "zustand/shallow";
import { useEffect } from "react"
import { useUserStore } from "@/stores/userStore"
import { useNavigate } from "react-router-dom"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MailOpen, UserCheck } from "lucide-react";


export function CheckOutSuccess() {
    const navigate = useNavigate()
    const { userLogout } = useUserStore(
        useShallow((state) => ({
            userLogout: state.userLogout,
        })),
    )
    useEffect(() => {
        setTimeout(() => {
            userLogout()
        }, 3000); // Wait for 2000 milliseconds (2 seconds)
    }, [])
    return (
        <>
            <div className={"flex flex-col gap-6 w-fit mt-4 mb-8 m-auto max-w-[500px]"}>
                <Card>
                    <CardHeader className="text-center">
                        <UserCheck size={32} className="m-auto" />
                        <CardTitle className="text-xl">Subscription Successful! </CardTitle>
                        <CardDescription>
                            You now have an active subscriptions, you will need to re-login.
                        </CardDescription>
                        <Button variant="outline" size="icon" className='mt-auto mb-auto w-fit m-auto' onClick={() => {
                            navigate('/auth')
                        }}>
                            <MailOpen /> Login
                        </Button>
                    </CardHeader>
                </Card>
            </div >
        </>
    )
}
