import { create } from 'zustand'
import { z } from 'zod';
import { persist, createJSONStorage } from 'zustand/middleware'
import { handleSubmit } from './util/streamUtil';


const streamLoadingType = z.object({
    streaming: z.boolean(),
});

const streamStateSchema = z.object({
    loading: streamLoadingType,

    routeto: z.optional(z.union([z.string(), z.null()])),
    toast: z.any(),

    streamLogout: z.function(),
    resetRouteTo: z.function(),
    resetToast: z.function(),
    resetLoading: z.function(),

    runStream: z.function(z.tuple([z.any(), z.any(), z.string()]), z.promise(z.any())),
});

export type streamType = z.infer<typeof streamStateSchema>

const initial_state = {
    loading: {
        streaming: false,
    },
    routeto: null,
    toast: null,
}

export const useStreamStore = create(
    persist<streamType>((set, get) => ({

        ...initial_state,


        streamLogout: () => set((state) => ({ ...state, ...initial_state })),
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

        runStream: async (
            aiRequestTicket: any,
            request_body: any,
            streamFlavour: string
        ) => {
            if (!get().loading.streaming) {
                set((state) => ({
                    loading: {
                        ...state.loading,
                        streaming: true,
                    },
                }));
                await new Promise(resolve => setTimeout(resolve, 300));
                try {
                    await handleSubmit(aiRequestTicket, request_body, streamFlavour);
                } catch (error) {
                    console.error(error);
                } finally {
                    // Reset loading.userLogin to false
                    set((state) => ({
                        loading: {
                            ...state.loading,
                            streaming: false,
                        },
                    }));
                }
            }
        },
    }),
        {
            name: 'stream-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    )
)
