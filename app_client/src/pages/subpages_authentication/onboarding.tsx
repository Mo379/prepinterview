"use client"

import { useForm, SubmitHandler, Controller } from "react-hook-form"


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
import { Loader2, Ship, TriangleAlert } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { Checkbox } from "@nextui-org/react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import InlineAlertComponent, { handleAlertColors } from "@/components/errors"




function OnBoarding() {
    const { auth, userOnBoarding, userLoading } = useUserStore(
        useShallow((state) => ({
            auth: state.auth,
            userOnBoarding: state.userOnBoarding,
            userLoading: state.loading,
        })),
    )
    const OnBoardingFormSchema = z.object({
        username: z.string().min(1, 'Username required!'),
        firstname: z.string().min(1, 'Firstname required!'),
        lastname: z.string().min(1, 'Lastname required!'),
        acceptterms: z.boolean(),
    }).refine((data) => data.acceptterms, { message: 'T&C & Privacy Acceptance Required', path: ['acceptterms'] });
    type OnBoardingFormType = z.infer<typeof OnBoardingFormSchema>
    const { register, handleSubmit, control, setError, formState: { errors } } = useForm<OnBoardingFormType>(
        { resolver: zodResolver(OnBoardingFormSchema) }
    )
    const onSubmit: SubmitHandler<OnBoardingFormType> = (data) => {
        userOnBoarding(
            setError,
            data.username,
            data.firstname,
            data.lastname,
            data.acceptterms,
        )
    }

    return (
        <>
            <div className={"flex flex-col gap-6 w-fit mt-4 mb-8 m-auto p-4"}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">
                            <Ship size={40} strokeWidth={1.75} absoluteStrokeWidth className='m-auto' />
                            OnBoarding</CardTitle>
                        <CardDescription>
                            We need a little more information about you!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <h2 className='text-xl text-center'> Step 1 </h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-6">
                                    <div className="grid gap-2 hidden">
                                        <Label htmlFor="username" className={`text-${errors.username && handleAlertColors(errors.username)}`}>Username</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            defaultValue={auth.username ? auth.username : ''}
                                            placeholder="username"
                                            {...register("username", { required: true })}
                                            className={`border border-${errors.username && handleAlertColors(errors.username)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.username && (
                                            <InlineAlertComponent custom_error={errors.username} />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstname" className={`text-${errors.firstname && handleAlertColors(errors.firstname)}`}>First Name</Label>
                                        <Input
                                            id="firstname"
                                            defaultValue={auth.firstname ? auth.firstname : ''}
                                            type="text"
                                            placeholder="firstname"
                                            {...register("firstname", { required: true })}
                                        />
                                        {errors.firstname && (
                                            <InlineAlertComponent custom_error={errors.firstname} />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastname" className={`text-${errors.lastname && handleAlertColors(errors.lastname)}`}>lastname</Label>
                                        <Input
                                            id="lastname"
                                            defaultValue={auth.lastname ? auth.lastname : ''}
                                            type="text"
                                            placeholder="lastname"
                                            {...register("lastname", { required: true })}
                                        />
                                        {errors.lastname && (
                                            <InlineAlertComponent custom_error={errors.lastname} />
                                        )}
                                    </div>
                                    <div className="w-full flex flex-col gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Controller
                                                control={control}
                                                name="acceptterms"
                                                rules={{ required: true }}
                                                render={({ field: { onChange, value } }) => (
                                                    <Checkbox
                                                        checked={value} // Binds the checked state to the value
                                                        onChange={onChange} // Updates the value when checkbox state changes
                                                        className={`rounded-lg border ${errors.acceptterms ? 'border-destructive' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                    >
                                                        I accept the T&C and Privacy Policy
                                                    </Checkbox>
                                                )}
                                            />
                                        </div>
                                        {errors.acceptterms && (
                                            <p className="flex flex-row mt-1 text-sm text-destructive ml-4">
                                                <TriangleAlert size={20} strokeWidth={1.75} absoluteStrokeWidth className='mr-1' /> {errors.acceptterms.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        {errors.root && (
                                            <div className={`p-4 rounded-md border border-${errors.root && handleAlertColors(errors.root)} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                                <InlineAlertComponent custom_error={errors.root} />
                                            </div>
                                        )}
                                    </div>
                                    {userLoading.userOnBoarding ? (
                                        <Button disabled className="w-full mt-4">
                                            <Loader2 className="animate-spin" />
                                        </Button>
                                    ) : (
                                        <Button type='submit' className='w-full mt-4'> OnBoard! </Button>
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

export default OnBoarding
