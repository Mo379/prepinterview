import { useForm, SubmitHandler } from "react-hook-form"
import ReCAPTCHA from "react-google-recaptcha"


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { captchaComponentType, useUserStore } from '@/stores/userStore'
import { Loader2 } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import { z } from "zod"
import InlineAlertComponent, { handleAlertColors } from "@/components/errors"
import { zodResolver } from "@hookform/resolvers/zod"



function ForgotPassword() {
    const captchaRef: any = useRef<captchaComponentType>(null)
    const { userForgotPassword, userLoading } = useUserStore(
        useShallow((state) => ({
            userForgotPassword: state.userForgotPassword,
            userLoading: state.loading,
        })),
    )
    const navigate = useNavigate();
    const ForgotPasswordFormSchema = z.object({
        username: z.string().min(1, 'Username/Email required'),
    })
    type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ForgotPasswordFormType>(
        { resolver: zodResolver(ForgotPasswordFormSchema) }
    )
    const onSubmit: SubmitHandler<ForgotPasswordFormType> = (data) => {
        const token = captchaRef.current.getValue();
        userForgotPassword(setError, data.username, token)
    }
    return (
        <>
            <div className={"flex flex-col gap-6 w-fit mt-4 mb-8 m-auto p-4"}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Hey :(</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <h1 className="mb-4 text-sm text-center">Sorry to hear the bad news, use this to reset your password.</h1>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className={`text-${errors.username && handleAlertColors(errors.username)}`} >Username/Email</Label>
                                    <Input
                                        type='text' placeholder='Enter Username or Email'
                                        {...register("username", { required: true })}
                                        className={`border border-${errors.username && handleAlertColors(errors.username)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.username && (
                                        <InlineAlertComponent custom_error={errors.username} />
                                    )}
                                </div>
                                <div className='flex flex-row justify-center m-4'>
                                    <ReCAPTCHA
                                        sitekey={(import.meta as any).env.VITE_SITE_KEY}
                                        ref={captchaRef}
                                        className='m-auto'
                                    />
                                </div>

                                <div className="grid gap-2">
                                    {errors.root && (
                                        <div className={`p-4 rounded-md border border-${errors.root && handleAlertColors(errors.root)} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                            <InlineAlertComponent custom_error={errors.root} />
                                        </div>
                                    )}
                                </div>
                                {userLoading.userForgotPassword ? (
                                    <Button disabled className="w-full mt-4">
                                        <Loader2 className="animate-spin" />
                                    </Button>
                                ) : (
                                    <Button type='submit' className='w-full mt-4'> Submit </Button>
                                )}
                            </form>

                            <div className="text-center text-sm">
                                Already have an account ?{" "}
                                <a
                                    onClick={() => navigate('/auth/login')}
                                    className="cursor-pointer underline underline-offset-4"
                                >
                                    Login
                                </a>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <a
                                    onClick={() => navigate('/auth/signup')}
                                    className="cursor-pointer underline underline-offset-4"
                                >
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                    By using this webapp you agree to our <a onClick={() => navigate('/terms')} className="cursor-pointer">Terms of Service</a>{" "}
                    and <a onClick={() => navigate('/privacy')} className="cursor-pointer">Privacy Policy</a>.
                </div>
            </div >
        </>
    )
}

export default ForgotPassword
