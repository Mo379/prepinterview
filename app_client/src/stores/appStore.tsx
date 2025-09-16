import { create } from 'zustand'
import { z } from 'zod';
import { persist, createJSONStorage } from 'zustand/middleware'


export const mdScreenSize: number = 768
export const SiteURL = (import.meta as any).env.VITE_SITE_URL


const appLoadingSchema = z.object({
    testLoading: z.boolean(),
})

const appStateSchema = z.object({
    loading: appLoadingSchema,
    routeto: z.optional(z.union([z.string(), z.null()])),

    isMdScreen: z.union([z.boolean(), z.null()]),
    navTab: z.optional(z.string()),
    setIsMdScreen: z.function(z.tuple([z.boolean()]), z.void()),
    showSideBar: z.union([z.boolean(), z.null()]),
    setShowSideBar: z.function(z.tuple([z.boolean()]), z.void()),

    toast: z.any(),

    resetRouteTo: z.function(),
    resetToast: z.function(),
    resetLoading: z.function()
})
export type appType = z.infer<typeof appStateSchema>

export const useAppStore = create(
    persist<appType>((set, _) => ({
        loading: {
            testLoading: false,
        },
        routeto: null,

        isMdScreen: null,
        navTab: '',
        activeComponent: null,
        activeSubComponent: null,
        setIsMdScreen: (value: boolean) => {
            set(() => ({ isMdScreen: value }));
        },
        showSideBar: true,
        setShowSideBar: (value: boolean) => {
            set(() => ({ showSideBar: value }));
        },

        toast: null,


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



    }),
        {
            name: 'app-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    )
)
