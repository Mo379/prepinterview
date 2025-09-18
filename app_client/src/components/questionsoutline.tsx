import { useShallow } from "zustand/shallow";

import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { useNoteStore } from "@/stores/noteStore";


export function QuestionsOutline() {
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
    //createRabiit(setError, props.is_general_tutor, props.lesson_hid, highlightedText, data.prompt, selectedImage).then((data) => {
    //    reset();
    //    setActiveRabiit(data.hid)
    //})

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

