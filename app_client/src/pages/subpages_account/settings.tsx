import { useForm, SubmitHandler } from "react-hook-form"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/userStore'
import { Loader2, Skull } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import InlineAlertComponent, { handleAlertColors } from "@/components/errors"

function AccountInformationForm() {
    const { userUpdateAccountInformation, userLoading, auth } = useUserStore(
        useShallow((state) => ({
            auth: state.auth,
            userUpdateAccountInformation: state.userUpdateAccountInformation,
            userLoading: state.loading,
        })),
    )
    const FormSchema = z.object({
        firstname: z.string().min(1, 'First name required'),
        lastname: z.string().min(1, 'Last name required'),
        username: z.string().min(1, 'Username required'),
    })
    type FormType = z.infer<typeof FormSchema>

    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })
    const onSubmit: SubmitHandler<FormType> = (data) => {
        userUpdateAccountInformation(
            setError,
            data.firstname,
            data.lastname,
            data.username,
        )
    }
    return (
        <>
            <div className={"flex flex-col gap-6 w-full mt-4 mb-8 m-auto"}>
                <h2 className='text-xl'> Account Information </h2>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between w-[98%] md:w-[80%]">
                            <div className="flex flex-col gap-2 w-full m-auto p-2">
                                <Label htmlFor="firstname" className={`text-${errors.firstname && handleAlertColors(errors.firstname)}`} >First Name</Label>
                                <Input
                                    id="firstname"
                                    placeholder="firstname"
                                    defaultValue={auth.firstname ? auth.firstname : ''}
                                    type='text'
                                    {...register("firstname")}
                                    className={`border border-${errors.firstname && handleAlertColors(errors.firstname)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.firstname && (
                                    <InlineAlertComponent custom_error={errors.firstname} />
                                )}
                            </div>
                            <div className="flex flex-col gap-2 w-full m-auto p-2">
                                <Label htmlFor="lastname" className={`text-${errors.lastname && handleAlertColors(errors.lastname)}`} >Last Name</Label>
                                <Input
                                    id="lastname"
                                    placeholder="lastname"
                                    defaultValue={auth.lastname ? auth.lastname : ''}
                                    type='text'
                                    {...register("lastname")}
                                    className={`border border-${errors.lastname && handleAlertColors(errors.lastname)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.lastname && (
                                    <InlineAlertComponent custom_error={errors.lastname} />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between w-[98%] md:w-[80%]">
                            <div className="flex flex-col gap-2 w-full m-auto p-2">
                                <Label htmlFor="username" className={`text-${errors.username && handleAlertColors(errors.username)}`} >Username</Label>
                                <Input
                                    id="username"
                                    placeholder="username"
                                    defaultValue={auth.username ? auth.username : ''}
                                    type='text'
                                    {...register("username")}
                                    className={`border border-${errors.username && handleAlertColors(errors.username)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.username && (
                                    <InlineAlertComponent custom_error={errors.username} />
                                )}
                            </div>
                            <div className="flex flex-col gap-2 w-full m-auto p-2">
                                <Label htmlFor="email" className=''>Email</Label>
                                <Input
                                    id="email"
                                    placeholder="email"
                                    defaultValue={auth.email ? auth.email : ''}
                                    disabled
                                    type='text'
                                    className={`border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            {errors.root && (
                                <div className={`p-4 rounded-md border border-${errors.root && handleAlertColors(errors.root)} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                    <InlineAlertComponent custom_error={errors.root} />
                                </div>
                            )}
                        </div>
                        <div className='w-40'>
                            {userLoading.userUpdateAccountInformation ? (
                                <Button disabled className="w-full mt-4">
                                    <Loader2 className="animate-spin" />
                                </Button>
                            ) : (
                                <Button type='submit' className='w-full mt-4'> Update </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div >
        </>
    )
}


function DangerAccountDeletionForm() {
    const { userAccountDeletion, userLoading, auth } = useUserStore(
        useShallow((state) => ({
            auth: state.auth,
            userAccountDeletion: state.userAccountDeletion,
            userLoading: state.loading,
        })),
    )

    const confirmation_string = `Permanently delete ${auth.username}`

    const FormSchema = z.object({
        confirmation: z.string().min(1, 'Please type the confirmation quote.'),
        password: z.string().min(1, 'Password required')
    }).refine((data) => { return data.confirmation === confirmation_string }, {
        message: 'Please enter the confirmation quote exactly.',
        path: ['confirmation']
    })
    type FormType = z.infer<typeof FormSchema>


    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })
    const onSubmit: SubmitHandler<FormType> = (data) => {
        userAccountDeletion(
            setError,
            data.password
        )
    }
    return (
        <>
            <div className={"flex flex-col gap-6 w-full mt-4 mb-8 m-auto border border-destructive rounded-xl p-4 mt-[250px]"}>
                <h2 className='text-xl underline italic'> Danger Zone </h2>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between w-[98%] md:w-[80%]">
                            <AlertDialog>
                                <AlertDialogTrigger className='flex flex-row w-full mt-4 w-40 border border-primary bg-destructive text-white'>
                                    <Skull size={16} strokeWidth={1.75} absoluteStrokeWidth className='mr-1' /> Delete Account
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <span className='text-primary'>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </span>
                                            <br />
                                            <br />
                                            <span className='mt-4 underline text-primary'>
                                                Confimration quote: <span className='underline'> {confirmation_string} </span>
                                            </span>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                                            <div className="flex flex-col">
                                                <div className="flex flex-col justify-between w-[98%] md:w-[80%]">
                                                    <div className="flex flex-col gap-2 w-full m-auto p-2">
                                                        <Input
                                                            id="confirmation"
                                                            placeholder="confirmation"
                                                            type='text'
                                                            {...register("confirmation")}
                                                            className={`border border-${errors.confirmation && handleAlertColors(errors.confirmation)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                        />
                                                        {errors.confirmation && (
                                                            <InlineAlertComponent custom_error={errors.confirmation} />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-2 w-full m-auto p-2">
                                                        <Label htmlFor="password" className={`text-${errors.password && handleAlertColors(errors.password)}`} >Password</Label>
                                                        <Input
                                                            id="password"
                                                            placeholder="Your password"
                                                            type='password'
                                                            {...register("password")}
                                                            className={`border border-${errors.password && handleAlertColors(errors.password)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                        />
                                                        {errors.password && (
                                                            <InlineAlertComponent custom_error={errors.password} />
                                                        )}
                                                    </div>
                                                    <div className='w-full flex flex-row justify-between my-4'>
                                                        <div className='w-40'>
                                                            {userLoading.userAccountDeletion ? (
                                                                <Button disabled className="w-full ">
                                                                    <Loader2 className="animate-spin" />
                                                                </Button>
                                                            ) : (
                                                                <Button type='submit' className='w-full text-destructive'> Permanently Delete</Button>
                                                            )}
                                                        </div>
                                                        <AlertDialogCancel className=''>Cancel</AlertDialogCancel>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </div>
                </form>
            </div >
        </>
    )
}
function Settings() {
    return (
        <>
            <div className='flex flex-col md:flex-row h-fit'>
                <div className="flex flex-col w-full md:w-[70%] h-full items-center justify-center p-6 m-auto">
                    <h1 className='text-4xl m-auto'> Account settings </h1>
                    <AccountInformationForm />
                    <DangerAccountDeletionForm />
                </div>
            </div>
        </>
    )
}

export default Settings
