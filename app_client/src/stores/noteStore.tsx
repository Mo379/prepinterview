import { create } from 'zustand'
import { z } from 'zod';
import { persist, createJSONStorage } from 'zustand/middleware'
import { useUserStore } from './userStore';
import { handleGeneralError, handleGeneralSuccess } from '@/functions/errors';
import { useStreamStore } from './streamStore';
import { APIURL } from './serviceStore';

// Helper to interpolate between two hex colors

const noteLoadingType = z.object({
    createRabiit: z.boolean(),
    getRabiits: z.boolean(),
    deleteRabiit: z.boolean(),
});

const noteStateSchema = z.object({
    loading: noteLoadingType,

    noteLogout: z.function(),

    routeto: z.optional(z.union([z.string(), z.null()])),
    resetRouteTo: z.function(),
    resetToast: z.function(),
    resetLoading: z.function(),
    toast: z.any(),
    resetNotes: z.function().args().returns(z.void()),

    highlightedText: z.any(),
    selectedImage: z.any(),
    openHighlightPopup: z.boolean(),
    rabiitsSheet: z.boolean(),
    rabiits: z.any(),
    highlightNotes: z.any(),

    setRabiitsSheet: z.function().args(z.boolean()).returns(z.void()),
    setRabiitContent: z.function(z.tuple([z.string(), z.any()])).returns(z.void()),
    addHighlightNote: z.function(z.tuple([z.any()])).returns(z.void()),

    createRabiit: z.function(z.tuple([z.any(), z.string(), z.string(), z.string()]), z.promise(z.any())),
    getRabiits: z.function().args(z.any(), z.string()).returns(z.void()),
    deleteRabiit: z.function().args(z.any(), z.string()).returns(z.void()),
});

export type noteType = z.infer<typeof noteStateSchema>

const initial_state = {
    loading: {
        createRabiit: false,
        getRabiits: false,
        deleteRabiit: false,
    },
    routeto: null,
    toast: null,

    highlightedText: undefined,
    openHighlightPopup: false,
    rabiitsSheet: false,
    rabiits: null,
    highlightNotes: [],
}

export const useNoteStore = create(
    persist<noteType>((set, get) => ({

        ...initial_state,


        noteLogout: () => set((state) => ({ ...state, ...initial_state })),
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
        resetNotes: () => {
            set(() => ({
                rabiits: null,
            }));
        },


        setRabiitsSheet: (value: boolean) => {
            set(() => ({
                rabiitsSheet: value
            }));
            if (!value) {
                set(() => ({
                    highlightedText: '',
                    selectedImage: ''
                }));
            }
        },

        setRabiitContent: (rabiit_hid: string, final_content: any) => {
            // Get the current list of lessons.
            var currentList = undefined;
            currentList = get().rabiits;

            // Find the index of the lesson that needs to be updated.
            const index = currentList.findIndex((rabiit: any) => rabiit.hid === rabiit_hid);

            if (index !== -1) {
                let updatedNote: any = { ...currentList[index] }

                // Update the state with the new list.
                updatedNote.content = final_content
                // Create a new list with the updated lesson replacing the old one.
                const updatedList = currentList.map((rabiit: any) =>
                    rabiit.hid === rabiit_hid ? updatedNote : rabiit
                );
                set({
                    rabiits: updatedList,
                });
            }

        },
        addHighlightNote: (newHighlightNote: any) => {
            set((state: any) => ({
                highlightNotes: [
                    ...state.highlightNotes,
                    newHighlightNote,
                ]
            }))
        },


        createRabiit: async (setError: any, space_hid: string, name: string, prompt: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, createRabiit: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                let response = await fetch(
                    `${APIURL}/notes/rabiit_list.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                        body: JSON.stringify({
                            space_hid: space_hid,
                            name: name,
                            prompt: prompt,
                        }),
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to create rabiit!');

                set((state) => ({
                    rabiits: [
                        data.data,
                        ...(state.rabiits || []),
                    ],
                }));
                useStreamStore.getState().runStream(
                    data.request_ticket,
                    { 'rabiit_hid': data.data.hid },
                    'rabiits_general_tutor'
                )

                handleGeneralSuccess(set, response, data, "Success: rabiit created!", null)
                return data.data
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, createRabiit: false },
                }));
            }
        },
        getRabiits: async (setError: any, lesson_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, getRabiits: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                let response = await fetch(
                    `${APIURL}/notes/rabiit_list/${lesson_hid}.json`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to load rabiits!');

                set(() => ({
                    rabiits: data.data,
                }));

                handleGeneralSuccess(set, response, data, "Success: rabiits loaded!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, getRabiits: false },
                }));
            }
        },
        deleteRabiit: async (setError: any, rabiit_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, deleteRabiit: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                let response = await fetch(
                    `${APIURL}/notes/rabiit_detail/${rabiit_hid}.json`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to delete!');

                set((state) => ({
                    rabiits: state.rabiits.filter((rabiit: any) => rabiit.hid !== data.data.hid)
                }));

                handleGeneralSuccess(set, response, data, "Success: deleted!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, deleteRabiit: false },
                }));
            }
        },
    }),
        {
            name: 'note-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    )
)
