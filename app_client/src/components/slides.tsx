import { Loader2, MoveLeft, Route } from "lucide-react";
import { useShallow } from "zustand/shallow";

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useSourceStore } from "@/stores/sourceStore";
import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { Slider } from "./ui/slider";
import SelectionButtonWrapper from "./highlighbutton";
import { useNoteStore } from "@/stores/noteStore";
import { Skeleton } from "./ui/skeleton";
import MarkdownWithPostHighlights from "./markdown_post_highlight";


export function InlineCitation(props: {
    data: any,
}) {
    const {
        getChunkDetails,
        sourceLoading,
    } = useSourceStore(
        useShallow((state) => ({
            getChunkDetails: state.getChunkDetails,
            sourceLoading: state.loading,
        })),
    )
    const [open, setOpen] = useState(false);
    const [chunkDetail, setChunkDetail] = useState<any>(false);
    const { setError } = useForm<any>()
    const chunk_hid = props.data.data.split('_')[0]
    const chunk_index = props.data.data.split('_')[1]

    return (
        <Popover open={open} onOpenChange={(open) => setOpen(open)}>
            <PopoverTrigger asChild>
                <Button
                    className={`w-4 h-4 text-center text-sm border mx-[2px] p-[3px] ${chunk_hid === 'null' && 'bg-yellow-500'}`}
                    variant='default'
                    onClick={() => {
                        if (chunk_hid !== 'null') {
                            getChunkDetails(setError, chunk_hid).then((data) => {
                                setChunkDetail(data)
                                useSourceStore.setState((state) => ({
                                    loading: { ...state.loading, getChunkDetails: false }
                                }))
                            })
                        }
                    }}
                >
                    {chunk_hid === 'null' ? (
                        '~'
                    ) : (
                        chunk_index
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="top" align="center" className={`
                max-h-[250px] overflow-scroll min-w-[30vw] max-w-[60vw] border-primary/75 scrollbar-hide
                !bg-secondary/60 !backdrop-blur-sm
                !text-primary
                `}
            >
                {chunk_hid === 'null' ? (
                    <span className='text-[12px]'>
                        This information was not obtained from any source directly,
                        this is based on the model's learned knowlegde and there is
                        a good chance it's a hellucination. Please double check this
                        information by reading multiple independed sources.
                    </span>
                ) : (
                    sourceLoading.getChunkDetails ? (
                        <Loader2 className='m-auto animate-spin mt-2' />
                    ) : (
                        chunk_hid === chunkDetail?.hid ? (
                            <Markdown
                                className={`!inline text-[12px]`}
                                remarkPlugins={[remarkMath, remarkGfm]}
                                rehypePlugins={[
                                    rehypeRaw,
                                    rehypeKatex as any,
                                    [rehypeHighlight, { ignoreMissing: true, plainTextInjection: true }],
                                ]}
                            >{chunkDetail.content}</Markdown>
                        ) : (
                            'Please try again.'
                        )
                    )
                )}
            </PopoverContent>
        </Popover >
    )
}

export function SlidesOverView() {
    const { closeHeadingIndex, generalTutorLesson } = useGeneralTutorStore(
        useShallow((state) => ({
            closeHeadingIndex: state.closeHeadingIndex,
            generalTutorLesson: state.generalTutorLesson,
        })),
    );
    const [open, setOpen] = useState(false);

    // Ref for the scrollable dialog content
    const dialogContentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open && typeof closeHeadingIndex === "number" && 'source' in generalTutorLesson) {
            // Run after the DOM updates
            requestAnimationFrame(() => {
                const activeHeadingId = generalTutorLesson?.source?.content?.outline?.[closeHeadingIndex]?.[1];
                const el = document.getElementById(`toc-${activeHeadingId}`);
                if (el && dialogContentRef.current) {
                    const container = dialogContentRef.current;

                    // Element's offset relative to container
                    const elOffsetTop = el.offsetTop;

                    // Calculate scrollTop to center the element
                    const scrollTop = elOffsetTop - container.clientHeight / 2 + el.clientHeight / 2;

                    container.scrollTo({
                        top: scrollTop,
                        behavior: 'instant' as ScrollBehavior,
                    });
                }
            });
        }
    }, [open, closeHeadingIndex, generalTutorLesson]);


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Button
                className='w-8 h-8 text-center !text-sm relative border-1 mr-2'
                variant='default'
                onClick={() => setOpen(true)}
            >
                <Route size={6} className={`w-8 h-8 mt-auto mb-auto`} />
            </Button>
            <AlertDialogContent
                ref={dialogContentRef} // <-- attach ref here
                className='w-fit !min-w-[35vw] max-w-[90vw] p-8 !min-h-[60vh] max-h-[80dvh] overflow-scroll scrollbar-hide'
            >
                <AlertDialogHeader>
                    <AlertDialogTitle>Table Of Content</AlertDialogTitle>
                    <AlertDialogDescription className='w-fit'>
                        <div className='flex flex-col gap-2'>
                            {"source" in generalTutorLesson && (
                                <ul className="space-y-2">
                                    {generalTutorLesson?.source?.content?.outline.map(
                                        ([text, id, level]: [string, string, number], index: number) => (
                                            <div className='flex flex-row' key={id} id={`toc-${id}`}>
                                                <li className={`ml-${(level - 1) * 4}`}>
                                                    <span
                                                        onClick={() => {
                                                            const el = document.getElementById(id);
                                                            const container = document.getElementById('chat_page_top');
                                                            if (container && el && 'offsetTop' in el) {
                                                                container.scrollTo({
                                                                    top: el.offsetTop - container.offsetTop,
                                                                    behavior: 'instant',
                                                                });
                                                            }
                                                            setOpen(false)
                                                            useGeneralTutorStore.setState({ closeHeadingIndex: index });
                                                        }}
                                                        className={`
                                                            text-primary/65 hover:text-primary hover:underline
                                                            transition-colors duration-200 hover:cursor-pointer
                                                            ${closeHeadingIndex === index && '!text-primary !underline'}
                                                        `}
                                                    >
                                                        {text}
                                                    </span>
                                                </li>
                                                {closeHeadingIndex === index && <MoveLeft className='mt-auto mb-auto stroke-red-600 ml-4' />}
                                            </div>
                                        ),
                                    )}
                                </ul>
                            )}
                        </div>
                    </AlertDialogDescription>
                    <AlertDialogCancel className='ml-auto mt-8'>Close</AlertDialogCancel>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}


export function SlidesProgressDisplay() {
    const { closeHeadingIndex, generalTutorLesson } = useGeneralTutorStore(
        useShallow((state) => ({
            closeHeadingIndex: state.closeHeadingIndex,
            generalTutorLesson: state.generalTutorLesson,
        }))
    );
    const [sliderValue, setSliderValue] = useState(0);

    const outline = 'source' in generalTutorLesson ? generalTutorLesson?.source?.content?.outline : []; // [[text, id, level], ...]
    const container = document.getElementById('chat_page_top');

    useEffect(() => {
        setSliderValue(closeHeadingIndex)
    }, [closeHeadingIndex])

    return (
        <div
            className={`
                relative w-[98%] min-h-[34px] p-1 flex flex-row justify-between pl-2 rounded-lg
                border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground
                hover:cursor-pointer
            `}
        >
            <span
                className="w-full flex flex-row mt-auto mb-auto overflow-hidden justify-between text-nowrap text-lg"
            >
                <SlidesOverView />
                <Slider
                    min={0}
                    max={outline.length - 1}
                    value={[sliderValue]}
                    step={1}
                    onValueChange={(value: any) => {
                        const slideId = outline[value]?.[1]; // second item is id
                        // optionally scroll to the element
                        const el = document.getElementById(slideId);
                        if (container && el && 'offsetTop' in el) {
                            container?.scrollTo({
                                top: el?.offsetTop - container.offsetTop,
                                behavior: 'instant',
                            });
                        }
                        setSliderValue(value)
                    }}
                    className={`
                        w-[95%] h-2 appearance-none
                        p-0
                        mt-auto mb-auto
                        mx-auto
                        text-red-700
                        mr-2
                    `}
                />
            </span>
        </div>
    );
}


export function Slides() {
    const { generalTutorLesson, generalTutorLoading } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorLesson: state.generalTutorLesson,
            generalTutorLoading: state.loading,
        })),
    );

    // helper: extract plain text from children
    function getTextFromNode(children: React.ReactNode): string {
        if (!children) return "";
        if (typeof children === "string") return children;
        if (Array.isArray(children)) return children.map(getTextFromNode).join("");
        if (typeof children === "object" && "props" in (children as any)) {
            return getTextFromNode((children as any).props.children);
        }
        return "";
    }

    const components = {
        h1: ({ node, ...props }: any) => {
            const text = getTextFromNode(props.children);
            return (
                <h1
                    id={text.split('__id__')[1]}
                    {...props}
                    className={`mt-4 mb-4 text-3xl font-bold ${props.className}`}
                >
                    {text.split('__id__')[0]}
                </h1>
            );
        },
        h2: ({ node, ...props }: any) => {
            const text = getTextFromNode(props.children);
            return (
                <h2
                    id={text.split('__id__')[1]}
                    {...props}
                    className={`mt-4 mb-4 text-2xl font-bold ${props.className}`}
                >
                    {text.split('__id__')[0]}
                </h2>
            );
        },
        h3: ({ node, ...props }: any) => {
            const text = getTextFromNode(props.children);
            return (
                <h3
                    id={text.split('__id__')[1]}
                    {...props}
                    className={`mt-4 mb-4 text-xl font-bold ${props.className}`}
                >
                    {text.split('__id__')[0]}
                </h3>
            );
        },
        p: ({ node, ...props }: any) => (
            <p
                {...props}
                className={`mt-8 mb-8 ${props.className}`}
            />
        ),
        hr: ({ node, ...props }: any) => (
            <hr
                {...props}
                className={`mt-[65px] mb-[65px] ${props.className} !border-2 border-primary rounded-full`}
            />
        ),
        img: ({ node, ...props }: any) => (
            <img
                {...props}
                className={`
                    mt-[65px] 
                    ${props.className} 
                    !border-2 border-info
                    rounded-xl 
                    m-auto 
                    shadow-md
                    dark:shadow-gray-400 
                    hover:shadow-lg
                    dark:hover:shadow-gray-200 
                    transition-transform 
                    duration-300 
                    ease-in-out 
                    hover:scale-105 
                    object-cover
                    hover:cursor-pointer
                    max-w-[85%]
                    max-h-[50vh]
                `}
                onClick={() => {
                    useNoteStore.setState({ selectedImage: props.src });
                    useNoteStore.getState().setRabiitsSheet(true);
                }}
            />
        ),
        table: ({ node, ...props }: any) => (
            <div className='m-auto !max-w-[90%] overflow-scroll'>
                <table
                    {...props}
                    className={`styled-table m-auto`}
                />
            </div>
        ),

    };
    const highlights = useNoteStore.getState().highlightNotes


    return (
        generalTutorLoading.generalTutorGetLesson ? (<Skeleton className='w-[90%] mt-[20vh] min-h-[30vh] rounded-xl' />) : (
            <div className="flex flex-col justify-center !w-full">
                <SelectionButtonWrapper is_general_tutor={true} lesson_hid={'hid' in generalTutorLesson ? generalTutorLesson?.hid : ''}>
                    <MarkdownWithPostHighlights
                        className="!inline text-[12px]"
                        components={components}
                        source={
                            "source" in generalTutorLesson
                                ? generalTutorLesson?.source?.content?.full_content ?? ""
                                : ""
                        }
                        ranges={highlights?.map((h: any) => ({
                            id: h.id,
                            start: h.start,
                            end: h.end,
                            color: h.color,
                        })) ?? []}
                    />
                </SelectionButtonWrapper>
            </div>
        )
    );
}


export function ConceptOutline() {
    const { generalTutorLesson } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorLesson: state.generalTutorLesson,
            generalTutorLoading: state.loading,
        })),
    );
    const { setRabiitsSheet, createRabiit } = useNoteStore(
        useShallow((state) => ({
            setRabiitsSheet: state.setRabiitsSheet,
            createRabiit: state.createRabiit,
        })),
    );
    const { setError } = useForm<any>()

    return (
        <div className="flex flex-col justify-center !w-full">
            <div className='flex flex-col flex-wrap gap-2'>
                {('source' in generalTutorLesson && generalTutorLesson.source.concept_outline.concepts) &&
                    generalTutorLesson.source.concept_outline.concepts.concept_sections.map((concept_section: any, section_idx: number) => (
                        <div
                            key={`concept_section_${section_idx}`}
                            className='mb-[80px]'
                        >
                            <div className="text-2xl underline underline-offset-4 mb-4">
                                {concept_section.section_name
                                    .toLowerCase()
                                    .replace(/\b\w/g, (char: any) => char.toUpperCase())}
                            </div>
                            <div className='flex flex-col gap-2 '>
                                {concept_section.concepts.map((concept: any, concept_idx: number) => (
                                    <Button
                                        key={`concept_item_${concept_idx}`}
                                        variant={'outline'}
                                        className='flex flex-wrap h-auto max-w-full h-auto text-wrap'
                                        onClick={() => {
                                            createRabiit(
                                                setError,
                                                true,
                                                generalTutorLesson.hid,
                                                '',
                                                `In only a few paragraphs explain the following concept in the context of this material: ${concept_section.section_name}:${concept}`,
                                                ''
                                            )
                                            setRabiitsSheet(true)
                                        }}
                                    >
                                        {concept
                                            .toLowerCase()
                                            .replace(/\b\w/g, (char: any) => char.toUpperCase())}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div >
    );
}

