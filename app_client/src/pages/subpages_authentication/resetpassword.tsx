import { useForm, SubmitHandler } from "react-hook-form"


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { useNavigate, useParams } from "react-router-dom"
import { useUserStore } from "@/stores/userStore"
import { Label } from "@radix-ui/react-label"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import InlineAlertComponent, { handleAlertColors } from "@/components/errors"



function ResetPassword() {
    const { userResetPassword, userLoading } = useUserStore(
        useShallow((state) => ({
            userResetPassword: state.userResetPassword,
            userLoading: state.loading,
        })),
    )
    const navigate = useNavigate();
    const ResetPasswordFormSchema = z.object({
        password: z.string().min(8, 'Password is too short!'),
        confirm_password: z.string().min(1, 'Lastname required!'),
        uidb64: z.string(),
        token: z.string(),
    }).refine((data) => data.password === data.confirm_password, {
        message: 'Passwords must match!',
        path: ['confirm_password']
    })
    type ResetPasswordFormType = z.infer<typeof ResetPasswordFormSchema>
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ResetPasswordFormType>(
        { resolver: zodResolver(ResetPasswordFormSchema) }
    )
    const { uidb64, activationToken } = useParams();

    const onSubmit: SubmitHandler<ResetPasswordFormType> = (data) => {
        userResetPassword(setError, data.password, data.confirm_password, data.uidb64, data.token)
    }
    return (
        <>
            <div className={"flex flex-col gap-6 w-fit mt-4 mb-8 m-auto p-4"}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">You're so back :)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <h1 className="mb-4 text-sm text-center">Enter your new password and submit!</h1>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-2 mb-4">
                                    <Label htmlFor="password" className={`text-${errors.password&& handleAlertColors(errors.password)}`} >Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="off"
                                        placeholder="Password"
                                        {...register("password", { required: true })}
                                        className={`border border-${errors.password && handleAlertColors(errors.password)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm_password" className={`text-${errors.confirm_password && handleAlertColors(errors.confirm_password)}`}>Confirm Password</Label>
                                    <Input
                                        id="confirm_password"
                                        type="password"
                                        autoComplete="off"
                                        placeholder="Confirm Password"
                                        {...register("confirm_password", { required: true })}
                                        className={`border border-${errors.confirm_password && handleAlertColors(errors.confirm_password)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>

                                <Input
                                    type='hidden' placeholder='uidb64'
                                    value={uidb64}
                                    {...register("uidb64", { required: true })}
                                />
                                <Input
                                    type='hidden' placeholder='token'
                                    value={activationToken}
                                    {...register("token", { required: true })}
                                />
                                <div className="grid gap-2">
                                    {errors.root && (
                                        <div className={`p-4 rounded-md border border-${errors.root && handleAlertColors(errors.root)} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                            <InlineAlertComponent custom_error={errors.root} />
                                        </div>
                                    )}
                                </div>
                                {userLoading.userResetPassword ? (
                                    <Button disabled className="w-full mt-4">
                                        <Loader2 className="animate-spin" />
                                    </Button>
                                ) : (
                                    <Button type='submit' className='w-full mt-4'> Reset Password</Button>
                                )}
                            </form>
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

export default ResetPassword
