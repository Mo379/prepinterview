import { useForm, SubmitHandler } from "react-hook-form"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/userStore'
import { Loader2 } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import InlineAlertComponent, { handleAlertColors } from "@/components/errors"
import { Textarea } from "@/components/ui/textarea"


function Contact() {
    const { userContact, userLoading } = useUserStore(
        useShallow((state) => ({
            userContact: state.userContact,
            userLoading: state.loading,
        })),
    )
    const ContactFormSchema = z.object({
        subject: z.string().min(5, 'Subject required.'),
        message: z.string().min(20, 'Message required. (20 chars mins)')
    })
    type ContactFormType = z.infer<typeof ContactFormSchema>

    const { register, handleSubmit, setError, formState: { errors } } = useForm<ContactFormType>({
        resolver: zodResolver(ContactFormSchema)
    })
    const onSubmit: SubmitHandler<ContactFormType> = (data) => {
        userContact(
            setError,
            data.subject,
            data.message
        )
    }
    return (
        <>
            <div className={"flex flex-col gap-6 w-fit mt-4 mb-8 m-auto"}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Welcome</CardTitle>
                        <CardDescription>
                        Contact Email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 min-w-[350px]">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subject" className={`text-${errors.subject && handleAlertColors(errors.subject)}`} >Email subject</Label>
                                        <Input
                                            id="email"
                                            placeholder="Email Subject..."
                                            type='text'
                                            {...register("subject")}
                                            className={`border border-${errors.subject && handleAlertColors(errors.subject)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.subject && (
                                            <InlineAlertComponent custom_error={errors.subject} />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="message" className={`text-${errors.message && handleAlertColors(errors.message)}`}>Message</Label>
                                        </div>
                                        <Textarea
                                            id="message"
                                            autoComplete="off"
                                            placeholder="Enter your message..."
                                            {...register("message")}
                                            className={`border border-${errors.message && handleAlertColors(errors.message)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.message && (
                                            <InlineAlertComponent custom_error={errors.message} />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        {errors.root && (
                                            <div className={`p-4 rounded-md border border-${errors.root && handleAlertColors(errors.root)} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                                <InlineAlertComponent custom_error={errors.root} />
                                            </div>
                                        )}
                                    </div>
                                    {userLoading.userContact ? (
                                        <Button disabled className="w-full mt-4">
                                            <Loader2 className="animate-spin" />
                                        </Button>
                                    ) : (
                                        <Button type='submit' className='w-full mt-4'> Send Message</Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div >
        </>
    )
}

export default Contact
