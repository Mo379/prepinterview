import { create } from 'zustand'
import { z } from 'zod';
import { persist, createJSONStorage } from 'zustand/middleware'
import { useUserStore } from './userStore';
import { handleGeneralError, handleGeneralSuccess } from '@/functions/errors';
import { assessmentType } from '@/types/sharedTypes';
import { APIURL } from './serviceStore';


const generalTutorLoadingType = z.object({

    generalTutorCreateLesson: z.boolean(),

    generalTutorGetSpaceSubscriptionList: z.boolean(),
    generalTutorUpdateSpace: z.boolean(),
    generalTutorDeleteSpace: z.boolean(),
    generalTutorCreateSpace: z.boolean(),
    generalTutorJoinSpace: z.boolean(),
    generalTutorSpaceEnableSharing: z.boolean(),

    generalTutorUpdateLesson: z.boolean(),
    generalTutorDeleteLesson: z.boolean(),
    generalTutorGetLessonList: z.boolean(),
    generalTutorGetLesson: z.boolean(),
    generalTutorGetLessonPage: z.boolean(),
});


const generalTutorStateSchema = z.object({
    loading: generalTutorLoadingType,

    routeto: z.optional(z.union([z.string(), z.null()])),
    toast: z.any(),

    learningMode: z.any(),

    generalTutorLogout: z.function(),
    resetLoading: z.function(),
    resetRouteTo: z.function(),
    resetToast: z.function(),

    setGeneralTutorActiveLesson: z.function().args(z.string()).returns(z.void()),
    setActiveGeneralTutorSpace: z.function().args(z.any()).returns(z.void()),

    generalTutorActiveLesson: z.string().nullable(),
    generalTutorInfinteScroll: z.object({ hasMore: z.boolean(), nextPage: z.number().nullable() }),

    generalTutorLessonCounts: z.object({
        total_lessons: z.number(),
        completed_lessons: z.number(),
    }),

    generalTutorSpaceSubscriptionList: z.array(
        z.object({
            hid: z.string(),
            space: z.any(),
            progress_track: z.any(),
        })
    ),
    generalTutorActiveSpace: z.any(),

    generalTutorLessonList: z.array(
        z.object({
            hid: z.string(),
            space: z.any(),
            query: z.array(z.string()).nullable(),
            lessontitle: z.string().nullable(),
            generated: z.boolean(),
            completed: z.boolean(),
            created_at: z.number(),
        })
    ),

    generalTutorLesson: z
        .object({
            hid: z.string(),
            space_hid: z.string(),
            lessontitle: z.string().nullable(),
            source: z.any().nullable(),
            completed: z.boolean(),
            created_at: z.number(),
        })
        .or(z.object({})),
    closeHeadingIndex: z.any(),

    generalTutorAssessment: assessmentType.nullable(),

    generalTutorGetLessonList: z.function(z.tuple([z.any(), z.string()]), z.void()),
    generalTutorGetLesson: z.function(z.tuple([z.any(), z.string()]), z.promise(z.any())),
    generalTutorGetLessonPage: z.function(z.tuple([z.any(), z.string(), z.number().nullable()]), z.void()),
    generalTutorUpdateLesson: z.function(z.tuple([z.any(), z.string(), z.any()]), z.void()),
    generalTutorDeleteLesson: z.function(z.tuple([z.any(), z.string(), z.string()]), z.void()),
    generalTutorCreateLesson: z.function(z.tuple([z.any(), z.string(), z.string(), z.string()]), z.void()),

    generalTutorGetSpaceSubscriptionList: z.function(z.tuple([z.any()]), z.void()),
    generalTutorUpdateSpace: z.function(z.tuple([z.any(), z.string(), z.string()]), z.void()),
    generalTutorDeleteSpace: z.function(z.tuple([z.any(), z.string()]), z.void()),
    generalTutorCreateSpace: z.function(z.tuple([z.any(), z.string()]), z.void()),
    generalTutorJoinSpace: z.function(z.tuple([z.any(), z.string()]), z.promise(z.any())),
    generalTutorSpaceEnableSharing: z.function(z.tuple([z.any(), z.string()]), z.promise(z.any())),

});



export type generalTutorType = z.infer<typeof generalTutorStateSchema>

const initial_state = {
    loading: {
        generalTutorCreateLesson: false,
        generalTutorGetSpaceSubscriptionList: false,
        generalTutorUpdateSpace: false,
        generalTutorDeleteSpace: false,
        generalTutorCreateSpace: false,
        generalTutorJoinSpace: false,
        generalTutorSpaceEnableSharing: false,
        generalTutorUpdateLesson: false,
        generalTutorDeleteLesson: false,
        generalTutorGetLessonList: false,
        generalTutorGetLesson: false,
        generalTutorGetLessonPage: false,
    },
    routeto: null,
    toast: null,

    learningMode: 'reading',

    generalTutorActiveLesson: null,
    generalTutorLessonCounts: {
        total_lessons: 0,
        completed_lessons: 0
    },
    generalTutorSpaceSubscriptionList: [],
    generalTutorActiveSpace: null,
    generalTutorLessonList: [],
    generalTutorLesson: {},
    closeHeadingIndex: undefined,
    generalTutorAssessment: null,
    generalTutorInfinteScroll: {
        hasMore: false,
        nextPage: null,
    },

}


export const useGeneralTutorStore = create(
    persist<generalTutorType>((set, get) => ({

        ...initial_state,


        generalTutorLogout: () => set((state) => ({ ...state, ...initial_state })),
        resetRouteTo: () => set({ routeto: null }),
        resetToast: () => set({ toast: null }),
        resetLoading: () => {
            set((state) => ({
                loading: Object.keys(state.loading).reduce((acc: any, key: string) => {
                    acc[key] = false;
                    return acc;
                }, {}),
            }));
        },


        setGeneralTutorActiveLesson: (lesson_hid: string) => {
            set(() => ({
                generalTutorActiveLesson: lesson_hid
            }));
        },
        setActiveGeneralTutorSpace: (space_obj: any) => {
            set(() => ({
                generalTutorActiveSpace: space_obj
            }));
        },


        generalTutorGetLessonList: async (setError: any, space_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorGetLessonList: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/lesson_list/${space_hid}.json`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to load lessons!')
                set(() => ({
                    generalTutorLessonList: data.data['general_tutor_lessons'],
                    generalTutorLessonCounts: data.data.lesson_counts,
                    generalTutorInfinteScroll: {
                        hasMore: data.data.hasMore,
                        nextPage: data.data.nextPage ? data.data.nextPage : null
                    }

                }));

                get().setGeneralTutorActiveLesson(data.data.general_tutor_lessons[0].hid)
                get().generalTutorGetLesson(setError, data.data.general_tutor_lessons[0].hid)

                handleGeneralSuccess(set, response, data, "Success: generalTutor lessons loaded!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorGetLessonList: false },
                }));
            }
        },
        generalTutorGetLesson: async (setError: any, lesson_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorGetLesson: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/lesson_detail/${lesson_hid}.json`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to load lesson!')
                set(() => ({
                    generalTutorLesson: data.data.general_tutor_lesson
                }));
                handleGeneralSuccess(set, response, data, "Success: generalTutor lesson loaded!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorGetLesson: false },
                }));
            }
        },
        generalTutorGetLessonPage: async (setError: any, space_hid: string, page: number | null) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorGetLessonPage: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/lesson_list/${space_hid}.json?page=${page}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to load lessons page!')
                set(() => ({
                    generalTutorLessonList: [...get().generalTutorLessonList, ...data.data.general_tutor_lessons],
                    generalTutorInfinteScroll: {
                        hasMore: data.data.hasMore,
                        nextPage: data.data.nextPage ? data.data.nextPage : null
                    }
                }));
                handleGeneralSuccess(set, response, data, "Success: generalTutor lessons page loaded!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorGetLessonPage: false },
                }));
            }
        },
        generalTutorUpdateLesson: async (setError: any, lesson_hid: string, lesson: any) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorUpdateLesson: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/lesson_update/${lesson_hid}.json`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },
                        body: JSON.stringify(lesson)
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to update lesson!');

                // Extract the updated lesson from the response.
                const updatedLesson = data.data.lesson;
                const lessonId = updatedLesson.hid;

                // Get the current list of lessons.
                const currentList = get().generalTutorLessonList;

                // Find the index of the lesson that needs to be updated.
                const index = currentList.findIndex(lesson => lesson.hid === lessonId);

                if (index !== -1) {
                    // Create a new list with the updated lesson replacing the old one.
                    const updatedList = currentList.map(lesson =>
                        lesson.hid === lessonId ? updatedLesson : lesson
                    );

                    // Update the state with the new list.
                    set({
                        generalTutorLessonList: updatedList,
                        generalTutorLessonCounts: data.data.lesson_counts,
                    });
                }

                handleGeneralSuccess(set, response, data, "Success: generalTutor lesson updated!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorUpdateLesson: false },
                }));
            }
        },
        generalTutorDeleteLesson: async (setError: any, lesson_hid: string, space_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorDeleteLesson: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/lesson_detail/${lesson_hid}.json`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to delete lesson!');

                const key_to_remove = 'hid'
                const value_to_remove = data.data
                set({ generalTutorLessonList: get().generalTutorLessonList.filter(obj => obj[key_to_remove] !== value_to_remove) });
                const temp_lesson = get().generalTutorLesson
                if ('hid' in temp_lesson && temp_lesson.hid === value_to_remove) {
                    set({
                        generalTutorLesson: {},
                        generalTutorActiveLesson: null
                    });
                }
                get().generalTutorGetLessonList(setError, space_hid)


                handleGeneralSuccess(set, response, data, "Success: generalTutor lesson deleted!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorDeleteLesson: false },
                }));
            }
        },
        generalTutorCreateLesson: async (setError: any, space_hid: string, source_hid: string, reading_title: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorCreateLesson: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/lesson_detail.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                        body: JSON.stringify({
                            space_hid: space_hid,
                            reading_title: reading_title,
                            source_hid: source_hid,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to create lesson!');

                set({
                    generalTutorLessonList: [data.data.general_tutor_lesson, ...get().generalTutorLessonList],
                    generalTutorLesson: data.data.general_tutor_lesson
                });
                get().setGeneralTutorActiveLesson(data.data.general_tutor_lesson.hid)


                handleGeneralSuccess(set, response, data, "Success: generalTutor lesson created!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorCreateLesson: false },
                }));
            }
        },


        generalTutorGetSpaceSubscriptionList: async (setError: any) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorGetSpaceSubscriptionList: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_subscription_list.json`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to fetch space subscriptions!');
                set({
                    generalTutorSpaceSubscriptionList: [
                        ...data.data,
                    ]
                });
                handleGeneralSuccess(set, response, data, "Success: space subscriptions fetched!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorGetSpaceSubscriptionList: false },
                }));
            }
        },
        generalTutorUpdateSpace: async (setError: any, space_hid: string, name: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorUpdateSpace: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_subscription_detail/${space_hid}.json`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },
                        body: JSON.stringify({ name: name })

                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to update space!');

                const updated_space = data.data
                const currentList = get().generalTutorSpaceSubscriptionList;
                const updatedList = currentList.map(space =>
                    space.hid === space_hid ? updated_space : space
                );

                set({
                    generalTutorSpaceSubscriptionList: updatedList
                });

                handleGeneralSuccess(set, response, data, "Success: space updated successfully!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorUpdateSpace: false },
                }));
            }
        },
        generalTutorDeleteSpace: async (setError: any, space_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorDeleteSpace: true },
                generalTutorLesson: {},
                generalTutorActiveLesson: null
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_subscription_detail/${space_hid}.json`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },

                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to delete space!');
                const key_to_remove = 'hid'
                const value_to_remove = data.data
                set({
                    generalTutorSpaceSubscriptionList: get().generalTutorSpaceSubscriptionList.filter(obj => obj[key_to_remove] !== value_to_remove)
                });


                handleGeneralSuccess(set, response, data, "Success: your space is deleted!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorDeleteSpace: false },
                }));
            }
        },
        generalTutorCreateSpace: async (setError: any, name: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorCreateSpace: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_subscription_list.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },
                        body: JSON.stringify({ name: name })

                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to create space!');
                set({
                    generalTutorSpaceSubscriptionList: [
                        data.data,
                        ...get().generalTutorSpaceSubscriptionList
                    ]
                });

                handleGeneralSuccess(set, response, data, "Success: your space is created!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorCreateSpace: false },
                }));
            }
        },
        generalTutorJoinSpace: async (setError: any, space_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorJoinSpace: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_join.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },
                        body: JSON.stringify({ space_hid: space_hid})

                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to join space!');
                set({
                    generalTutorSpaceSubscriptionList: [
                        ...data.data,
                    ]
                });
                handleGeneralSuccess(set, response, data, "Success: You joined this space!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorJoinSpace: false },
                }));
            }
        },
        generalTutorSpaceEnableSharing: async (setError: any, space_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorSpaceEnableSharing: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_open.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },
                        body: JSON.stringify({ space_hid: space_hid})

                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to open space!');
                set({
                    generalTutorActiveSpace: data.data,
                });
                handleGeneralSuccess(set, response, data, "Success: Your space is now open!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorSpaceEnableSharing: false },
                }));
            }
        },

    }),
        {
            name: 'general-tutor-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    )
)
