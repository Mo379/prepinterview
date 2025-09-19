import { useShallow } from "zustand/shallow";

import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { useNoteStore } from "@/stores/noteStore";
import { CircleCheckBig } from "lucide-react";


export function QuestionsOutline(props: { space_hid: string }) {
    const { generalTutorActiveSpace } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorActiveSpace: state.generalTutorActiveSpace,
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
                {('content' in generalTutorActiveSpace && generalTutorActiveSpace.content.questions_outline) &&
                    generalTutorActiveSpace.content.questions_outline.map((concept_section: any, section_idx: number) => (
                        <div
                            key={`concept_section_${section_idx}`}
                            className='mb-[80px]'
                        >
                            <div className="text-2xl underline underline-offset-4 mb-4">
                                {concept_section?.category_name?.toLowerCase()
                                    .replace(/\b\w/g, (char: any) => char.toUpperCase())}
                            </div>
                            <div className='flex flex-col gap-2 '>
                                {concept_section?.category_questions?.map((concept: any, concept_idx: number) => (
                                    <Button
                                        key={`concept_item_${concept_idx}`}
                                        variant={'outline'}
                                        className='flex flex-row justify-between flex-wrap h-auto max-w-full h-auto text-wrap ml-0'
                                        onClick={() => {
                                            createRabiit(
                                                setError,
                                                props.space_hid,
                                                `${concept}`,
                                                `In only a few paragraphs explain the following concept in the context of this material: ${concept_section.category_name}:${concept}`,
                                            )
                                            setRabiitsSheet(true)
                                        }}
                                    >
                                        <span>
                                            {concept
                                                .toLowerCase()
                                                .replace(/\b\w/g, (char: any) => char.toUpperCase())}
                                        </span>
                                        <CircleCheckBig />

                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div >
    );
}

