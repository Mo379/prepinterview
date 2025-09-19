import { BriefcaseBusiness, Loader2, MessagesSquare, CirclePlus } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";


import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import InlineAlertComponent, { handleAlertColors } from "@/components/errors";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNoteStore } from "@/stores/noteStore";


export function CreateSpaceDialog() {
    const { generalTutorCreateSpace, setActiveGeneralTutorSpace, generalTutorLoading } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorCreateSpace: state.generalTutorCreateSpace,
            setActiveGeneralTutorSpace: state.setActiveGeneralTutorSpace,
            generalTutorLoading: state.loading,
        })),
    )
    const [open, setOpen] = useState(false);


    const FormSchema = z.object({
        name: z.string().min(1, 'Please provice a name for the case.'),
        context: z.string().min(1, 'Please provice context for the case.'),
    })
    type FormType = z.infer<typeof FormSchema>


    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })
    const navigate = useNavigate()


    const onSubmit: SubmitHandler<FormType> = (data) => {
        generalTutorCreateSpace(setError, data.name, data.context).then((space_hid) => {
            navigate('/case')
            setActiveGeneralTutorSpace({hid: space_hid, name: data.name})
        })
        setOpen(false)
    }


    return (
        !open ? (
            <Button
                className='w-fit text-center !p-[26px] flex flex-row justify-center border-primary/35 md:m-0 m-auto'
                type='button'
                onClick={() => { setOpen(true) }}
            >
                <div className='flex flex-row'>
                    <CirclePlus
                        className="!w-[20px] !h-[20px] mt-auto mb-auto m-auto mr-1" />
                    <span
                        className="mt-auto mb-auto text-lg w-full overflow-hidden"
                    >
                        Create Case
                    </span>
                </div>
            </Button>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='w-full border-2 p-4 bg-primary/5 rounded-xl'>
                <div className="flex flex-col">
                    <h1 className='text-xl'>Create Case</h1>
                    <div className="flex flex-col justify-between w-[98%] md:w-[80%]">
                        <div className="flex flex-col gap-2 w-full m-auto p-2">
                            <Label htmlFor="name" className={`text-${errors.name && handleAlertColors(errors.name)}`} >Case Name</Label>
                            <Input
                                placeholder="case name..."
                                id="name"
                                {...register("name")}
                                className={`
                                    border border-${errors.name && handleAlertColors(errors.name)}
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                `}
                            />
                            {errors.name && (
                                <InlineAlertComponent custom_error={errors.name} />
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full m-auto p-2">
                            <Label htmlFor="context" className={`text-${errors.context && handleAlertColors(errors.context)}`} >Case Context</Label>
                            <Textarea
                                placeholder="case context..."
                                id="context"
                                {...register("context")}
                                className={`
                                    border border-${errors.context && handleAlertColors(errors.context)}
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                `}
                            />
                            {errors.context && (
                                <InlineAlertComponent custom_error={errors.context} />
                            )}
                        </div>
                        <div className='w-full flex flex-row justify-between my-4'>
                            <div className='w-40'>
                                {generalTutorLoading.generalTutorCreateSpace ? (
                                    <Button disabled className="w-full ">
                                        <Loader2 className="animate-spin" />
                                    </Button>
                                ) : (
                                    <Button type='submit' className='w-full '> Create </Button>
                                )}
                            </div>
                            <Button type='button' className='' onClick={() => { setOpen(false) }}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </form>
        )
    )
}
export function Home() {
    const {
        isMdScreen
    } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
        })),
    )
    const {
        resetNotes,
        getRabiits,
    } = useNoteStore(
        useShallow((state) => ({
            resetNotes: state.resetNotes,
            getRabiits: state.getRabiits,
        })),
    )
    const {
        generalTutorGetSpaceDetail,

        generalTutorSpaceList,
        generalTutorGetSpaceList,
        generalTutorLoading,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorGetSpaceDetail: state.generalTutorGetSpaceDetail,
            generalTutorSpaceList: state.generalTutorSpaceList,
            generalTutorGetSpaceList: state.generalTutorGetSpaceList,
            generalTutorLoading: state.loading,
        })),
    )
    const navigate = useNavigate()


    const { setError } = useForm<any>()
    useEffect(() => {
        generalTutorGetSpaceList(setError)
    }, [
    ])

    return (
        <div className='flex flex-row  m-auto !min-h-full !break-words text-pretty px-1 md:px-2 dark:text-primary/80 w-full'>
            <div className={`flex flex-col md:flex-row-reverse mx-auto text-xl  w-full ${isMdScreen ? ('p-0') : ("p-2 !justify-center")} gap-2`}>
                <div className={`
                flex flex-col justify-between text-break text-wrap w-[min(98%,900px)] mx-auto h-fit
                `}>
                    <div>
                        <div className='text-center !w-full mb-8'>
                            <BriefcaseBusiness className="m-auto" size={35} />
                            <span>Start Prep</span>
                        </div>
                        <div>
                            {generalTutorLoading.generalTutorGetSpaceList ? (<Loader2 className='m-auto animate-spin' />) : (
                                <div className={`flex flex-row justify-center flex-wrap gap-2 mt-2`}>
                                    <div className='w-full flex flex-col md:flex-row justify-center gap-4 mb-8'>
                                        <CreateSpaceDialog />
                                    </div>
                                    {generalTutorSpaceList?.map((space: any) => (
                                        space?.name && (
                                            <Button
                                                size="icon"
                                                className='relative w-44 mr-1 h-10 mt-1 text-center !p-4 flex flex-row justify-center'
                                                onClick={() => {
                                                    navigate('/case')
                                                    generalTutorGetSpaceDetail(setError, space.hid)
                                                    resetNotes()
                                                    getRabiits(setError, space.hid)
                                                }}
                                                key={`space_${space?.hid}`}
                                            >
                                                <div className='flex flex-row overflow-hidden'>
                                                    <MessagesSquare className="!w-[20px] !h-[20px] mt-auto mb-auto mr-2" />
                                                    <span
                                                        className="mt-auto mb-auto text-md w-full overflow-hidden"
                                                    >
                                                        {space?.name}
                                                    </span>
                                                </div>
                                            </Button>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
