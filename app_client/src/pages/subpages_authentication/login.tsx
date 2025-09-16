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
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import InlineAlertComponent, { handleAlertColors } from "@/components/errors"
import { FaGoogle } from "react-icons/fa6"


function Login() {
    const { userLogin, googleLogin, userLoading } = useUserStore(
        useShallow((state) => ({
            userLogin: state.userLogin,
            googleLogin: state.googleLogin,
            userLoading: state.loading,
        })),
    )
    const navigate = useNavigate();
    const LoginFormSchema = z.object({
        username: z.string().min(1, 'Username/Email required'),
        password: z.string().min(1, 'Password required'),
    })
    type LoginFormType = z.infer<typeof LoginFormSchema>

    const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormType>({
        resolver: zodResolver(LoginFormSchema)
    })
    const onSubmit: SubmitHandler<LoginFormType> = (data) => {
        userLogin(setError, data.username, data.password)
    }
    return (
        <>
            <div className={"flex flex-col gap-6 w-fit mt-4 mb-8 m-auto p-4"}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Welcome back</CardTitle>
                        <CardDescription>
                            Login with your Username or Email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className={`text-${errors.username && handleAlertColors(errors.username)}`} >Username/Email</Label>
                                        <Input
                                            id="email"
                                            placeholder="username or email@example.com"
                                            type='text'
                                            {...register("username")}
                                            className={`border border-${errors.username && handleAlertColors(errors.username)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            disabled={userLoading.userLogin || userLoading.googleLogin}
                                        />
                                        {errors.username && (
                                            <InlineAlertComponent custom_error={errors.username} />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password" className={`text-${errors.password && handleAlertColors(errors.username)}`}>Password</Label>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="off"
                                            placeholder="Password"
                                            {...register("password")}
                                            className={`border border-${errors.password && handleAlertColors(errors.username)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            disabled={userLoading.userLogin || userLoading.googleLogin}
                                        />
                                        {errors.password && (
                                            <InlineAlertComponent custom_error={errors.password} />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        {errors.root && (
                                            <div className={`p-4 rounded-md border border-${errors.root && handleAlertColors(errors.root)} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                                <InlineAlertComponent custom_error={errors.root} />
                                            </div>
                                        )}
                                    </div>
                                    {userLoading.userLogin || userLoading.googleLogin? (
                                        <Button disabled className="w-full mt-4">
                                            <Loader2 className="animate-spin" />
                                        </Button>
                                    ) : (
                                        <>
                                            <Button type='submit' className='w-full mt-4'> login </Button>
                                            <Button type='button' className='w-full mt-0' onClick={() => { googleLogin(setError) }}>
                                                {userLoading.googleLogin ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <FaGoogle />Google login
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </form>
                            <div className="text-center text-sm">
                                <a
                                    onClick={() => navigate('/auth/forgot_password')}
                                    className="cursor-pointer ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
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
                    By clicking Login, you agree to our <a onClick={() => navigate('/terms')} className="cursor-pointer">Terms of Service</a>{" "}
                    and <a onClick={() => navigate('/privacy')} className="cursor-pointer">Privacy Policy</a>.
                </div>
            </div >
        </>
    )
}

export default Login
