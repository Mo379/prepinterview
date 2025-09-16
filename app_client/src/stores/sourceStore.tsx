import { create } from 'zustand'
import { z } from 'zod';
import { persist, createJSONStorage } from 'zustand/middleware'
import { useUserStore } from './userStore';
import { handleGeneralError, handleGeneralSuccess } from '@/functions/errors';
import { APIURL } from './serviceStore';


const sourceLoadingType = z.object({
    uploadSource: z.boolean(),
    confirmFileUpload: z.boolean(),
    getSources: z.boolean(),
    getSourceStatus: z.boolean(),
    deleteSource: z.boolean(),
    getChunkDetails: z.boolean(),

    getSourceActivation: z.boolean(),
    updateSourceActivation: z.boolean(),
    updateSourceLessonActivation: z.boolean(),
});

const sourceStateSchema = z.object({
    loading: sourceLoadingType,

    routeto: z.optional(z.union([z.string(), z.null()])),
    resetRouteTo: z.function(),
    resetToast: z.function(),
    resetLoading: z.function(),
    toast: z.any(),
    sources: z.any(),
    source_activation: z.any(),

    sourceLogout: z.function(),
    uploadSource: z.function(z.tuple([z.any(), z.any(), z.boolean(), z.string()]), z.promise(z.any())),
    confirmFileUpload: z.function(z.tuple([z.any(), z.string()]), z.promise(z.any())),
    getSources: z.function(z.tuple([z.any(), z.boolean(), z.string()]), z.promise(z.any())),
    getSourceStatus: z.function(z.tuple([z.any(), z.boolean(), z.string()]), z.promise(z.any())),
    deleteSource: z.function(z.tuple([z.any(), z.string()]), z.promise(z.any())),
    getChunkDetails: z.function(z.tuple([z.any(), z.string()]), z.promise(z.any())),
    getSourceActivation: z.function(z.tuple([z.any(), z.boolean(), z.string(), z.string()]), z.promise(z.any())),
    updateSourceActivation: z.function(z.tuple([z.any(), z.string(), z.any(), z.any()]), z.promise(z.any())),
    updateSourceLessonActivation: z.function(z.tuple([z.any(), z.string(), z.string(), z.any(), z.any()]), z.promise(z.any())),
});

export type sourceType = z.infer<typeof sourceStateSchema>

const initial_state = {
    loading: {
        uploadSource: false,
        confirmFileUpload: false,
        getSources: false,
        getSourceStatus: false,
        deleteSource: false,
        getChunkDetails: false,
        getSourceActivation: false,
        updateSourceActivation: false,
        updateSourceLessonActivation: false,
    },
    routeto: null,
    toast: null,

    sources: {},
    source_activation: []
}

export const useSourceStore = create(
    persist<sourceType>((set, get) => ({

        ...initial_state,


        sourceLogout: () => set((state) => ({ ...state, ...initial_state })),
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


        uploadSource: async (setError: any, body_data: any, is_general_tutor: boolean, object_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, uploadSource: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let upload_url = 'sources/upload_ticket';

                body_data.set('is_general_tutor', is_general_tutor ? 1 : 0)
                body_data.set('object_hid', object_hid)

                let response = await fetch(
                    `${APIURL}/${upload_url}.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                        body: body_data,
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to upload source!');

                set((state) => ({
                    sources: {
                        ...state.sources,
                        source_list: [
                            ...(Array.isArray(data.data) ? data.data : [data.data]),
                            ...state.sources.source_list
                        ]
                    },
                }));

                handleGeneralSuccess(set, response, data, "Success: new source added!", null)
                return data.data;
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, uploadSource: false },
                }));
            }
        },
        confirmFileUpload: async (setError: any, source_hid: any) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, confirmFileUpload: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let upload_url = `sources/confirm_file_upload/${source_hid}`;

                let response = await fetch(
                    `${APIURL}/${upload_url}.json`,
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
                handleGeneralError(setError, set, response, data, 'Failed to confirm source upload!');

                let currentList = get().sources.source_list
                let updated_source = data.data
                // Find the index of the lesson that needs to be updated.
                const index = currentList.findIndex((source: any) => source.hid === updated_source.hid);
                if (index !== -1) {
                    const updatedList = currentList.map((source: any) =>
                        source.hid === updated_source.hid ? updated_source : source
                    );
                    // Update the state with the new list.
                    set({
                        sources: {
                            ...get().sources,
                            source_list: updatedList
                        },
                    });
                }

                handleGeneralSuccess(set, response, data, "Success: source upload confirmed!", null)
                return data.data;
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, confirmFileUpload: false },
                }));
            }
        },
        getSources: async (setError: any, is_general_tutor: boolean, object_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, getSources: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let upload_url = 'sources/list';

                let response = await fetch(
                    `${APIURL}/${upload_url}/${is_general_tutor ? 'general_tutor' : 'course'}/${object_hid}.json`,
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
                handleGeneralError(setError, set, response, data, 'Failed to load sources!');

                set(() => ({
                    sources: data.data,
                }));

                handleGeneralSuccess(set, response, data, "Success: source loaded!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, getSources: false },
                }));
            }
        },
        getSourceStatus: async (setError: any, is_general_tutor: boolean, object_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, getSourceStatus: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let upload_url = 'sources/status_list';

                let response = await fetch(
                    `${APIURL}/${upload_url}/${is_general_tutor ? 'general_tutor' : 'course'}/${object_hid}.json`,
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
                handleGeneralError(setError, set, response, data, 'Failed to load source status!');

                const updatedSources = get().sources.source_list.map((src: any) => {
                    // find an update object with the same hid
                    const upd = data.data.source_list.find((u: any) => u.hid === src.hid);
                    // if found, merge it in; otherwise leave the original
                    return upd ? { ...src, ...upd } : src;
                });

                // then set it into state
                set(() => ({
                    sources: {
                        ...get().sources,
                        source_list: updatedSources,
                    },
                }));

                handleGeneralSuccess(set, response, data, "Success: source status loaded!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, getSourceStatus: false },
                }));
            }
        },

        deleteSource: async (setError: any, source_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, deleteSource: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {

                let response = await fetch(
                    `${APIURL}/sources/detail/${source_hid}.json`,
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
                handleGeneralError(setError, set, response, data, 'Failed to delete source!');

                set((state) => ({
                    sources: {
                        ...state.sources,
                        source_list: state.sources.source_list.filter((source: any) => source.hid !== data.data.hid)
                    },
                }));

                handleGeneralSuccess(set, response, data, "Success: source deleted!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, deleteSource: false },
                }));
            }
        },


        getChunkDetails: async (setError: any, chunk_hid: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, getChunkDetails: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {

                let response = await fetch(
                    `${APIURL}/sources/chunk_detail/${chunk_hid}.json`,
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
                handleGeneralError(setError, set, response, data, 'Failed to detail chunk!');
                handleGeneralSuccess(set, response, data, "Success: source detail loaded!", null)
                return data.data
            } catch (error) {
                console.error(error);
            }
        },

        getSourceActivation: async (setError: any, is_general_tutor: boolean, object_hid: string, lesson_key: string) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, getSourceActivation: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let upload_url = 'sources/source_activation';

                let response = await fetch(
                    `${APIURL}/${upload_url}/${is_general_tutor ? 'general_tutor' : 'course'}/${object_hid}/${lesson_key}.json`,
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
                handleGeneralError(setError, set, response, data, 'Failed to load source activation!');

                // then set it into state
                set(() => ({
                    source_activation: data.data,
                }));

                handleGeneralSuccess(set, response, data, "Success: source activation loaded!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, getSourceActivation: false },
                }));
            }
        },

        updateSourceActivation: async (
            setError: any,
            source_hid: string,
            original_activation: any,
            updated_activation: any
        ) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, updateSourceActivation: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let upload_url = 'sources/source_activation_update';

                let response = await fetch(
                    `${APIURL}/${upload_url}/${source_hid}.json`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                        body: JSON.stringify(updated_activation)
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                if (!response.ok) {
                    original_activation = original_activation ? original_activation : { source_hid: source_hid }
                    set((state) => ({
                        source_activation: state.source_activation.map((item: any) => item.source_hid === source_hid ? original_activation : item)
                    }));
                }
                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to update source activation!');
                delete data.data.lesson_activation
                set((state) => ({
                    source_activation: state.source_activation.map((item: any) => item.source_hid === data.data.source_hid ? {...item, ...data.data} : item)
                }));
                handleGeneralSuccess(set, response, data, "Success: source activation updated!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, updateSourceActivation: false },
                }));
            }
        },
        updateSourceLessonActivation: async (
            setError: any,
            source_hid: string,
            lesson_key: string,
            is_active: string,
            original_activation: any,
        ) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, updateSourceLessonActivation: true },
            }));

            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let upload_url = 'sources/source_lesson_activation_update';

                let response = await fetch(
                    `${APIURL}/${upload_url}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                        body: JSON.stringify({
                            source_hid: source_hid,
                            lesson_key: lesson_key,
                            is_active: is_active
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                if (!response.ok) {
                    original_activation = original_activation ? original_activation : { source_hid: source_hid }
                    set((state) => ({
                        source_activation: state.source_activation.map((item: any) => item.source_hid === source_hid ? original_activation : item)
                    }));
                }
                // check and report errors
                handleGeneralError(setError, set, response, data, 'Failed to update source lesson activation!');
                //set((state) => ({
                //    source_activation: state.source_activation.map((item: any) => item.source_hid === data.data.source_hid ? data.data : item)
                //}));
                handleGeneralSuccess(set, response, data, "Success: source lesson activation updated!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, updateSourceLessonActivation: false },
                }));
            }
        },
    }),
        {
            name: 'source-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    )
)
