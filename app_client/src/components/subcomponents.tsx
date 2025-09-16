import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CirclePower, CircleUserRound, CreditCard, BriefcaseBusiness, MailOpen, UserRound } from "lucide-react";
import { useNavigate } from 'react-router-dom';

import { useAppStore } from "@/stores/appStore";
import { useShallow } from "zustand/shallow";
import { useUserStore } from "@/stores/userStore";
import { ThemeToggle } from "./themetoggle";
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Footer from './footer';




function PrivateUserProfile({ closeTrigger }: any) {
    const { isMdScreen } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen
        })),
    )
    const { userLogout, auth } = useUserStore(
        useShallow((state) => ({
            userLoading: state.loading,
            auth: state.auth,

            userLogin: state.userLogin,
            userLogout: state.userLogout,
            userUpdateToken: state.userUpdateToken
        })),
    )
    const navigate = useNavigate();

    const componentsMap: { [key: string]: any } = {
        'DialogClose': DialogClose,
        'SheetTrigger': SheetTrigger,
    };

    const TriggerComponent = componentsMap[closeTrigger];
    const ProfileButtonStyle = `
    flex flex-row justify-start w-full text-secondary dark:text-primary p-2
    mb-2
    `
    const ProfileButtonSpacing = `mr-1`

    return (
        <div className='flex flex-col'>
            {!isMdScreen ? (
                <>
                    {auth.hid ? (
                        <div className='flex flex-col justify-center h-32'>
                            <div className='m-auto text-center'>
                                <CircleUserRound size={48} strokeWidth={1} absoluteStrokeWidth className='m-auto' />
                                <div className='text-sm'>{auth.username}</div>
                                <div className='text-sm text-primary/60'>{auth.firstname} {auth.lastname} </div>
                                <div className='text-xs text-primary/60'>{auth.email} </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col justify-center h-32'>
                            <div className='flex flex-col m-auto justify-center'>
                                <BriefcaseBusiness size={40} strokeWidth={1.75} absoluteStrokeWidth className='m-auto' />
                                <div className='text-xl text-center'>
                                    Welcome to PrepInterview
                                </div>
                                <div className='text-ring text-center/25 text-xs m-auto text-center'>
                                    Simple & Powerful Interview Questions
                                </div>
                            </div>
                        </div>
                    )}
                    <Separator className="my-4" />
                </>
            ) : (
                <>
                    {!auth.hid ? (
                        <>
                            <div className='flex flex-col justify-center h-32'>
                                <div className='flex flex-col m-auto justify-center'>
                                    <BriefcaseBusiness size={40} strokeWidth={1.75} absoluteStrokeWidth className='m-auto' />
                                    <div className='text-xl text-center'>
                                        Welcome to PrepInterview
                                    </div>
                                    <div className='text-ring text-center/25 text-xs m-auto text-center'>
                                        Simple & Powerful Interview Questions
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />
                        </>
                    ) : (
                        null
                    )}
                </>
            )}

            {auth.hid ? (
                <>
                    <div className='flex flex-col'>
                        <TriggerComponent onClick={() => { navigate('/account') }} asChild>
                            <Button
                                variant="ghost"
                                className={ProfileButtonStyle}
                            >
                                <UserRound size={16} strokeWidth={1.25} absoluteStrokeWidth className={ProfileButtonSpacing} /> Account
                            </Button>
                        </TriggerComponent>

                        <TriggerComponent onClick={() => { navigate('/account/billing') }} asChild>
                            <Button
                                variant="ghost"
                                className={ProfileButtonStyle}
                            >
                                <CreditCard size={16} strokeWidth={1.25} absoluteStrokeWidth className={ProfileButtonSpacing} /> Billing
                            </Button>
                        </TriggerComponent>
                    </div>
                    <Separator className="my-4" />
                </>
            ) : (
                null
            )}


            <div className='flex flex-row justify-between'>
                <ThemeToggle />

                <Separator orientation="vertical" className='mx-2' />

                {auth.hid ? (
                    <Button variant="destructive" className="w-full" onClick={() => { userLogout() }}>
                        <CirclePower size={16} strokeWidth={1.25} absoluteStrokeWidth /> logout
                    </Button>
                ) : (
                    <TriggerComponent onClick={() => { navigate('/auth') }} asChild>
                        <Button variant="outline" className="w-full" onClick={() => { navigate('/auth') }}>
                            <MailOpen /> Login
                        </Button>
                    </TriggerComponent>
                )
                }
            </div>
        </div >
    );
}

export function UserProfileItem() {
    const { auth } = useUserStore(
        useShallow((state) => ({
            auth: state.auth,
        })),
    )
    const { isMdScreen } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
        })),
    )
    return (
        <>
            {!auth.hid ? (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className='mt-auto mb-auto w-fit h-10'>
                            <MailOpen /> Login
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <PrivateUserProfile closeTrigger={'DialogClose'} />
                    </DialogContent>
                </Dialog>
            ) : (
                isMdScreen ? (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className='mt-auto mb-auto w-fit h-10'>
                                <CircleUserRound /> Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle></DialogTitle>
                            </DialogHeader>
                            <PrivateUserProfile closeTrigger={'DialogClose'} />
                        </DialogContent>
                    </Dialog>
                ) : (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className='mt-auto mb-auto w-fit h-10'>
                                <CircleUserRound /> Account
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[260px]" hideClose={false}>
                            <SheetTitle></SheetTitle>
                            <SheetHeader>
                            </SheetHeader>
                            <PrivateUserProfile closeTrigger={'SheetTrigger'} />
                            <Footer />
                        </SheetContent>
                    </Sheet>
                )
            )}
        </>
    );
}
