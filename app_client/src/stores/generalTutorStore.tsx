import { create } from 'zustand'
import { z } from 'zod';
import { persist, createJSONStorage } from 'zustand/middleware'
import { useUserStore } from './userStore';
import { handleGeneralError, handleGeneralSuccess } from '@/functions/errors';
import { APIURL } from './serviceStore';


const generalTutorLoadingType = z.object({
    generalTutorGetSpaceList: z.boolean(),
    generalTutorDeleteSpace: z.boolean(),
    generalTutorCreateSpace: z.boolean(),
});


const generalTutorStateSchema = z.object({
    loading: generalTutorLoadingType,

    routeto: z.optional(z.union([z.string(), z.null()])),
    toast: z.any(),

    generalTutorLogout: z.function(),
    resetLoading: z.function(),
    resetRouteTo: z.function(),
    resetToast: z.function(),

    setActiveGeneralTutorSpace: z.function().args(z.any()).returns(z.void()),

    generalTutorInfinteScroll: z.object({ hasMore: z.boolean(), nextPage: z.number().nullable() }),

    generalTutorSpaceList: z.array(
        z.object({
            hid: z.string(),
            space: z.any(),
            progress_track: z.any(),
        })
    ),
    generalTutorActiveSpace: z.any(),

    closeHeadingIndex: z.any(),

    generalTutorGetSpaceList: z.function(z.tuple([z.any()]), z.void()),
    generalTutorDeleteSpace: z.function(z.tuple([z.any(), z.string()]), z.void()),
    generalTutorCreateSpace: z.function(z.tuple([z.any(), z.string(), z.string()]), z.void()),

});



export type generalTutorType = z.infer<typeof generalTutorStateSchema>

const initial_state = {
    loading: {
        generalTutorGetSpaceList: false,
        generalTutorDeleteSpace: false,
        generalTutorCreateSpace: false,
    },
    routeto: null,
    toast: null,

    learningMode: 'reading',

    generalTutorSpaceList: [],
    generalTutorActiveSpace: null,
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


        setActiveGeneralTutorSpace: (space_obj: any) => {
            set(() => ({
                generalTutorActiveSpace: space_obj
            }));
        },


        generalTutorGetSpaceList: async (setError: any) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorGetSpaceList: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_list.json`,
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
                    generalTutorSpaceList: [
                        ...data.data,
                    ]
                });
                handleGeneralSuccess(set, response, data, "Success: space subscriptions fetched!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, generalTutorGetSpaceList: false },
                }));
            }
        },
        generalTutorDeleteSpace: async (setError: any, space_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorDeleteSpace: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_detail/${space_hid}.json`,
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
                    generalTutorSpaceList: get().generalTutorSpaceList.filter(obj => obj[key_to_remove] !== value_to_remove)
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
        generalTutorCreateSpace: async (setError: any, name: string, context: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, generalTutorCreateSpace: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/general_tutor/space_list.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),

                        },
                        body: JSON.stringify({ name: name, context: context })

                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to create space!');
                set({
                    generalTutorSpaceList: [
                        data.data,
                        ...get().generalTutorSpaceList
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
    }),
        {
            name: 'general-tutor-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    )
)
