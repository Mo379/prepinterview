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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import InlineAlertComponent, { handleAlertColors } from "@/components/errors"



function AccountActivation() {
    const { userActivation, userLoading } = useUserStore(
        useShallow((state) => ({
            userActivation: state.userActivation,
            userLoading: state.loading,
        })),
    )
    const navigate = useNavigate();
    const ActivationFormSchema = z.object({
        uidb64: z.string(),
        token: z.string(),
    })
    type ActivationFormType = z.infer<typeof ActivationFormSchema>
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ActivationFormType>(
        { resolver: zodResolver(ActivationFormSchema) }
    )
    const { uidb64, activationToken } = useParams();

    const onSubmit: SubmitHandler<ActivationFormType> = (data) => {
        userActivation(setError, data.uidb64, data.token)
    }
    return (
        <>
            <div className={"flex flex-col gap-6 w-fit mt-4 mb-8 m-auto p-4"}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">You're almost finished :)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <h1 className="mb-4 text-sm text-center">Click here and your account should be ready!</h1>
                            <form onSubmit={handleSubmit(onSubmit)}>
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
                                {userLoading.userActivation ? (
                                    <Button disabled className="w-full mt-4">
                                        <Loader2 className="animate-spin" />
                                    </Button>
                                ) : (
                                    <Button type='submit' className='w-full mt-4'> Activate </Button>
                                )}
                            </form>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                    By clicking Activate, you agree to our <a onClick={() => navigate('/terms')} className="cursor-pointer">Terms of Service</a>{" "}
                    and <a onClick={() => navigate('/privacy')} className="cursor-pointer">Privacy Policy</a>.
                </div>
            </div >
        </>
    )
}

export default AccountActivation
