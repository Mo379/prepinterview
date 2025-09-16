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
import { captchaComponentType, useUserStore } from '@/stores/userStore'
import { Loader2 } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import InlineAlertComponent, { handleAlertColors } from "@/components/errors"

function Signup() {
    const { userSignup, userLoading } = useUserStore(
        useShallow((state) => ({
            userSignup: state.userSignup,
            userLoading: state.loading,
        })),
    )
    const navigate = useNavigate();

    const captchaRef: any = useRef<captchaComponentType>(null)
    const SignUpFormSchema = z.object({
        email: z.string().email('Valid Email required!'),
        password: z.string().min(8, 'Password is too short!'),
        confirm_password: z.string().min(1, 'Confirm password required!'),
    }).refine((data) => data.password === data.confirm_password, {
        message: 'Passwords must match!',
        path: ['confirm_password']
    })
    type SingUpFormType = z.infer<typeof SignUpFormSchema>
    const { register, handleSubmit, setError, formState: { errors } } = useForm<SingUpFormType>(
        { resolver: zodResolver(SignUpFormSchema) }
    )
    const onSubmit: SubmitHandler<SingUpFormType> = (data) => {
        const token = captchaRef.current.getValue();
        userSignup(
            setError,
            data.email,
            data.password,
            data.confirm_password,
            token,
        )

    }
    return (
        <>
            <div className={"flex flex-col gap-6 w-fit mt-4 mb-8 m-auto p-4"}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Welcome!</CardTitle>
                        <CardDescription>
                            SignUp with your Email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className={`text-${errors.email && handleAlertColors(errors.email)}`}>Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            {...register("email", { required: true })}
                                            className={`border border-${errors.email && handleAlertColors(errors.email)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.email && (
                                            <InlineAlertComponent custom_error={errors.email} />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className={`text-${errors.password && handleAlertColors(errors.password)}`}>Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="off"
                                            placeholder="Password"
                                            {...register("password", { required: true })}
                                            className={`border border-${errors.password && handleAlertColors(errors.password)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.password && (
                                            <InlineAlertComponent custom_error={errors.password} />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="confirm_password"
                                            className={`text-${errors.confirm_password && handleAlertColors(errors.confirm_password)}`}
                                        > Confirm Password</Label>
                                        <Input
                                            id="confirm_password"
                                            type="password"
                                            autoComplete="off"
                                            placeholder="Confirm Password"
                                            {...register("confirm_password", { required: true })}
                                            className={`border border-${errors.confirm_password && handleAlertColors(errors.confirm_password)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.confirm_password && (
                                            <InlineAlertComponent custom_error={errors.confirm_password} />
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
                                    {userLoading.userSignup ? (
                                        <Button disabled className="w-full mt-4">
                                            <Loader2 className="animate-spin" />
                                        </Button>
                                    ) : (
                                        <Button type='submit' className='w-full mt-4'> SignUp </Button>
                                    )}
                                </div>
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
                        </div>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                    By clicking Signup, you agree to our <a onClick={() => navigate('/terms')} className="cursor-pointer">Terms of Service</a>{" "}
                    and <a onClick={() => navigate('/privacy')} className="cursor-pointer">Privacy Policy</a>.
                </div>
            </div >
        </>
    )
}

export default Signup
