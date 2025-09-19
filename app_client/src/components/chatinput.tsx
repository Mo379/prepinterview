import { HeartCrack, Loader2, Rabbit, Trash, X } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useAppStore } from "@/stores/appStore";

import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Pulsing } from "./pulsing";
import { z } from "zod";
import { Checkbox, Skeleton } from "@nextui-org/react";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight';

import { useStreamStore } from "@/stores/streamStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatMath } from "@/stores/serviceStore";
import rehypeRaw from "rehype-raw";
import { useNoteStore } from "@/stores/noteStore";


export const button_style = 'hover:bg-primary/10 mr-1 md:mr-2 rounded-full p-[4px] md:p-[8px] hover:cursor-pointer mt-auto mb-auto'
export const icon_style = "!w-[28px] !h-[28px] md:!h-[28px] md:!w-[28px] shrink-0 transition-transform duration-200 stroke-primary p-[2px]"


export function DeleteRabiit(props: { rabiit_hid: string, setOpenDeleteNote: any }) {
    const {
        deleteRabiit,
        noteLoading
    } = useNoteStore(
        useShallow((state) => ({
            deleteRabiit: state.deleteRabiit,
            noteLoading: state.loading,
        })),
    )
    const noteDeleteFormSchema = z.object({
        confirm: z.literal(true),
    })
    type noteDeleteFormType = z.infer<typeof noteDeleteFormSchema>
    const { handleSubmit, control, setError } = useForm<noteDeleteFormType>(
        { resolver: zodResolver(noteDeleteFormSchema) }
    )
    const onSubmit: SubmitHandler<noteDeleteFormType> = (data) => {
        if (data.confirm) {
            deleteRabiit(
                setError,
                props.rabiit_hid,
            )
        }
    }
    return (
        <form>
            <div className="grid gap-6">
                <div className="w-full flex flex-col gap-4">
                    <div className="flex items-center space-x-2 gap-1 justify-end">
                        <Controller
                            control={control}
                            name="confirm"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    checked={value} // Binds the checked state to the value
                                    onChange={onChange} // Updates the value when checkbox state changes
                                    className={`rounded-lg border border-destructive focus:outline-none focus:ring-2 focus:ring-blue-500 mt-auto mb-auto`}
                                >
                                    Confirm
                                </Checkbox>
                            )}
                        />
                        {noteLoading.deleteRabiit ? (
                            <Button disabled className="w-8 mt-auto mb-auto">
                                <Loader2 className="animate-spin" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type='button'
                                    className='w-8 mt-auto mb-auto'
                                    onClick={() => { handleSubmit(onSubmit)() }}
                                >
                                    <Trash />
                                </Button>
                                <Button className='w-8 mt-auto mb-auto' onClick={() => { props.setOpenDeleteNote(null) }}> <X /> </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}
export function SheetRabbit(props: { space_hid: string }) {
    const {
        isMdScreen,
    } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
        })),
    )
    const {
        streamLoading
    } = useStreamStore(
        useShallow((state) => ({
            streamLoading: state.loading,
        })),
    )
    const {
        rabiitsSheet,
        setRabiitsSheet,

        rabiits,
        activeRabiit,
        setActiveRabiit,

        getRabiits,
        noteLoading,
    } = useNoteStore(
        useShallow((state) => ({
            highlightedText: state.highlightedText,
            selectedImage: state.selectedImage,
            rabiitsSheet: state.rabiitsSheet,
            setRabiitsSheet: state.setRabiitsSheet,

            rabiits: state.rabiits,
            activeRabiit: state.activeRabiit,
            setActiveRabiit: state.setActiveRabiit,

            createRabiit: state.createRabiit,
            getRabiits: state.getRabiits,
            noteLoading: state.loading,
        })),
    )


    const [openDeleteRabiit, setOpenDeleteRabiit] = useState<any | null>(null)
    const FormSchema = z.object({
        prompt: z.string().min(3, 'min 3 characters.'),
    })
    type FormType = z.infer<typeof FormSchema>


    const { setError } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })
    const prevRabiitsLength = useRef(rabiits?.length)

    useEffect(() => {
        const prevLength = prevRabiitsLength?.current
        const currLength = rabiits?.length

        if (typeof currLength === 'number' && typeof prevLength === 'number' && currLength > prevLength && rabiits[0]?.hid) {
            setActiveRabiit(rabiits[0]?.hid)
        } else if (rabiits?.length === 1) {
            setActiveRabiit(rabiits[0]?.hid)
        }

        prevRabiitsLength.current = currLength
    }, [rabiits])
    return (
        <Sheet open={rabiitsSheet} onOpenChange={setRabiitsSheet}>
            <SheetTrigger asChild onClick={(e) => {
                e.preventDefault()
                setRabiitsSheet(true)
            }}>
                <span className={`${button_style} ml-1 flex flex-row w-fit !m-auto`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (rabiits === null) {
                            getRabiits(setError, props.space_hid)
                        }
                    }}
                >
                    <Rabbit size={14} className={`${icon_style} !stroke-primary !w-[50px] !h-[50px]`} />
                </span>
            </SheetTrigger>
            <SheetContent hideClose={false} className={`${isMdScreen ? '!min-w-full p-2' : '!min-w-[85dvw]'}`}>
                <SheetHeader>
                    <SheetTitle className='flex flex-row'><Rabbit size={45} className='!w-6 !h-6 mr-2' /> RABIITs</SheetTitle>
                </SheetHeader>
                {noteLoading.getRabiits ? (
                    <div className='flex flex-col gap-2 mt-8'>
                        <Skeleton className="w-[94%] h-[48px] rounded-xl" />
                        <Skeleton className="w-[94%] h-[48px] rounded-xl" />
                        <Skeleton className="w-[94%] h-[48px] rounded-xl" />
                    </div>
                ) : (
                    !rabiits || rabiits.length == 0 ? (
                        <span className='flex flex-row w-fit m-auto mt-16'>
                            You have not created any items! <HeartCrack className='ml-4 mt-auto mb-auto stroke-red-400' />
                        </span>
                    ) : (
                        <Accordion
                            type="single"
                            value={typeof activeRabiit === 'string' ? String(activeRabiit) : undefined}
                            className={`${isMdScreen ? 'w-full' : 'w-[97%]'} mt-8 m-auto mb-[50vh]`}
                        >
                            {noteLoading.createRabiit && (
                                <div className='flex flex-col gap-2 mt-8'>
                                    <Skeleton className="w-[97%] h-[48px] rounded-xl" />
                                </div>
                            )}
                            <div className='flex flex-row justify-end w-full p-4 mb-2'>
                                {streamLoading.streaming && (<Pulsing className='ml-auto mt-4 w-fit' />)}
                            </div>
                            {rabiits.map((rabiit: any) => (
                                <AccordionItem
                                    value={String(rabiit.hid)}
                                    className="border-0 mt-1"
                                    key={`rabiit_item_${rabiit.hid}`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                    }}
                                >
                                    <div className={`${!isMdScreen && 'pl-1 ml-2'}`}>
                                        <div
                                            className={`
                                        relative w-full h-[48px] p-1 flex flex-row justify-start pl-2 rounded-lg
                                        border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground
                                        hover:cursor-pointer
                                    `}

                                            onClick={(event) => {
                                                event.stopPropagation();
                                                event.preventDefault();
                                                setActiveRabiit(rabiit.hid !== activeRabiit ? rabiit.hid : undefined)
                                            }}
                                        >

                                            <span
                                                className='w-full flex flex-row mt-auto mb-auto overflow-hidden justify-start text-nowrap text-md'
                                                style={{
                                                    WebkitMaskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                                    maskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                                }}
                                            >
                                                <Rabbit size={6} className={`${icon_style} !stroke-primary mt-auto mb-auto mr-4`} />
                                                {rabiit.name}
                                            </span>
                                        </div>
                                        <AccordionContent>
                                            <div className={`
                                                flex flex-col text-balance
                                                ${isMdScreen ? 'w-full p-2' : 'ml-4 p-4 gap-4 w-[90%] border-l border-primary/35'}
                                            `}>
                                                <span className={`
                                                    border-l border-primary/25 text-primary/60
                                                    ${isMdScreen ? 'pl-2' : 'ml-4 pl-2'}
                                                `}
                                                >
                                                    {rabiit.prompt} <br /> <br />
                                                </span>
                                                <div className='flex flex-row  m-auto !min-h-full !break-words text-pretty px-1 md:px-2 dark:text-primary/80 w-full'>
                                                    <div className={`
                                                            flex flex-col justify-between text-break text-wrap w-[min(98%,900px)] mx-auto
                                                            `}
                                                    >
                                                        <h1 className="!text-[16px] underline underline-offset-4 font-medium mb-8"> {rabiit.content['response_title']} </h1>
                                                        <div key={`rabiit_${rabiit.hid}_paragraph`} className="mb-4">
                                                            <p className="text-base leading-relaxed ml-2">
                                                                <Markdown
                                                                    className={`!inline`}
                                                                    remarkPlugins={[remarkMath, remarkGfm]}
                                                                    rehypePlugins={[
                                                                        rehypeRaw,
                                                                        rehypeKatex as any,
                                                                        [rehypeHighlight, { ignoreMissing: true, plainTextInjection: true }],
                                                                    ]}
                                                                >
                                                                    {
                                                                        formatMath(rabiit.content.response)
                                                                    }
                                                                </Markdown>
                                                            </p>
                                                        </div>
                                                        {streamLoading.streaming && (<Pulsing className='ml-auto mt-4' />)}
                                                    </div>
                                                </div>
                                                {!streamLoading.streaming && (
                                                    openDeleteRabiit != rabiit.hid ? (
                                                        <Button
                                                            type='submit'
                                                            className='!w-[12px] bg-destructive ml-auto p-4'
                                                            onClick={() => {
                                                                setOpenDeleteRabiit(rabiit.hid)
                                                            }}
                                                        >
                                                            <Trash className='!w-[12px]' />
                                                        </Button>
                                                    ) : (
                                                        <DeleteRabiit rabiit_hid={rabiit.hid} setOpenDeleteNote={setOpenDeleteRabiit} />
                                                    )
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )
                )
                }
            </SheetContent>
        </Sheet >
    )
}
