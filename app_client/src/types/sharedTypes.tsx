import { z } from 'zod';

export const courseType = z.object({
    description: z.string(),
    hid: z.string(),
    default_lnum: z.string(),
    icon_url: z.string(),
    level: z.string(),
    n_subscriptions: z.string(),
    n_lessons: z.number(),
    name: z.string(),
    display_name: z.string(),
    subject: z.string(),
    total_n_chats: z.string(),
    visibility: z.string(),
    completed: z.boolean(),
});

export const flashCardsType = z.object({
    assessment_type: z.string(),
    content: z.object({
        flashcards: z.array(z.object({
            backside_answer: z.string(),
            frontside_question: z.string(),
        })),
        unique_id: z.string(),
        user_input: z.record(z.string()).optional(),
        marking: z.string().optional(),
    }),
    description: z.object({
        chapter: z.string().optional(),
        course: z.string().optional(),
        lesson: z.string().optional(),
        point_title: z.string().optional(),
        query: z.string().optional(),
        lessontitle: z.string().optional(),
    }),
    hid: z.string(),
    lesson_hid: z.string(),
    lnum: z.string(),
    score: z.string(),
    completed: z.boolean(),
});

export const quizType = z.object({
    assessment_type: z.string(),
    content: z.object({
        quiz: z.array(z.object({
            answer: z.object({
                answer: z.string(),
                correct_choice: z.string(),
            }),
            choices: z.record(z.string()),
            question: z.string(),
        })),
        unique_id: z.string(),
        user_input: z.record(z.string()).optional(),
        marking: z
            .tuple([z.string(), z.record(z.string()), z.record(z.string())])
            .optional(),
    }),
    description: z.object({
        chapter: z.string().optional(),
        course: z.string().optional(),
        lesson: z.string().optional(),
        point_title: z.string().optional(),
        query: z.string().optional(),
        lessontitle: z.string().optional(),
    }),
    hid: z.string(),
    lesson_hid: z.string(),
    lnum: z.string(),
    score: z.string(),
    completed: z.boolean(),
});

export const vocabularyType = z.object({
    assessment_type: z.string(),
    content: z.object({
        vocabulary_description: z.array(
            z.object({
                vocabulary_words: z.string(),
                vocabulary_hints: z.string(),
            })
        ),
        unique_id: z.string(),
        user_input: z.array(z.string()).optional(),
        marking: z.number().optional(),
    }),
    description: z.object({
        chapter: z.string().optional(),
        course: z.string().optional(),
        lesson: z.string().optional(),
        point_title: z.string().optional(),
        query: z.string().optional(),
        lessontitle: z.string().optional(),
    }),
    hid: z.string(),
    lesson_hid: z.string(),
    lnum: z.string(),
    score: z.string(),
    completed: z.boolean(),
});

export const clozeCardsType = z.object({
    assessment_type: z.string(),
    content: z.object({
        clozecards_description: z.object({
            clozecards_questions: z.string(),
            clozecards_answers: z.string(),
        }),
        unique_id: z.string(),
        user_input: z.array(z.array(z.string())).optional(),
        marking: z.number().optional(),
    }),
    description: z.object({
        chapter: z.string().optional(),
        course: z.string().optional(),
        lesson: z.string().optional(),
        point_title: z.string().optional(),
        query: z.string().optional(),
        lessontitle: z.string().optional(),
    }),
    hid: z.string(),
    lesson_hid: z.string(),
    lnum: z.string().optional(),
    score: z.string(),
    completed: z.boolean(),
});

const blankType = z.object({ assessment_type: z.string() });

export const assessmentType = z.union([
    blankType,
    flashCardsType,
    quizType,
    vocabularyType,
    clozeCardsType,
]);
