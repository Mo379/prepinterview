import { create } from 'zustand'
import { z } from 'zod';
import { persist, createJSONStorage } from 'zustand/middleware'
import { useUserStore } from './userStore';
import { handleGeneralError, handleGeneralSuccess } from '@/functions/errors';
import { jsonrepair } from 'jsonrepair';


export const APIURL = (import.meta as any).env.VITE_API_URL;
export const YtAPIKey = (import.meta as any).env.VITE_YOUTUBE_API_KEY;
export const GoogleClientID = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
export function formatMath(lesson: any) {
    const replacements = {
        '\\(': '$',
        '\\)': '$',
        '\\[': '$$',
        '\\]': '$$'
    };

    if (lesson) {
        return Object.entries(replacements)
            .reduce((str, [pattern, replacement]) =>
                str.replaceAll(pattern, replacement),
                lesson
            );
    }
    return lesson
}
export const myjsonrepair = (dirtyJson: string) => {
    try {
        if (dirtyJson && typeof dirtyJson === 'string') {
            let smoother_char = ''
            if (dirtyJson.charAt(dirtyJson.length - 1) !== '}') {
                smoother_char = '"'
            }
            JSON.parse(jsonrepair(dirtyJson + smoother_char))
            return jsonrepair(dirtyJson + smoother_char);
        }
        return false;
    } catch (err) {
        return false;
    }
}

const serviceLoadingType = z.object({
    serviceCreateCheckoutSession: z.boolean(),
    serviceCreatePortalSession: z.boolean(),
});

const serviceStateSchema = z.object({
    loading: serviceLoadingType,

    routeto: z.optional(z.union([z.string(), z.null()])),
    toast: z.any(),

    serviceLogout: z.function(),
    resetRouteTo: z.function(),
    resetToast: z.function(),
    resetLoading: z.function(),

    serviceCreateCheckoutSession: z.function(z.tuple([z.any(), z.number()]), z.promise(z.any())),
    serviceCreatePortalSession: z.function(z.tuple([z.any()]), z.promise(z.any())),

});

export type serviceType = z.infer<typeof serviceStateSchema>

const initial_state = {
    loading: {
        serviceCreateCheckoutSession: false,
        serviceCreatePortalSession: false,
    },
    routeto: null,
    toast: null,
}


export const useServiceStore = create(
    persist<serviceType>((set, _) => ({

        ...initial_state,



        serviceLogout: () => set((state) => ({ ...state, ...initial_state })),
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

        serviceCreateCheckoutSession: async (setError: any, item_number: number) => {
            const accessToken = useUserStore.getState().auth.accessToken
            set((state) => ({
                loading: { ...state.loading, serviceCreateCheckoutSession: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/create_customer_checkout_session.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                        body: JSON.stringify({
                            'item_number': item_number,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Loading Checkout Session Failed!')
                setTimeout(() => {
                    window.location.href = data.data['url'];
                }, 500); // Wait for 2000 milliseconds (2 seconds)
                handleGeneralSuccess(set, response, data, "Success: Checkout Session Created, you will be redirected shortly!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, serviceCreateCheckoutSession: false },
                }));
            }
        },
        serviceCreatePortalSession: async (setError: any) => {
            const accessToken = useUserStore.getState().auth.accessToken
            const userLogout = useUserStore.getState().userLogout
            set((state) => ({
                loading: { ...state.loading, serviceCreatePortalSession: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/create_customer_portal_session.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(accessToken),
                        },
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Loading Portal Failed!')
                setTimeout(() => {
                    window.location.href = data.data['url'];
                }, 2000); // Wait for 2000 milliseconds (2 seconds)
                userLogout()
                handleGeneralSuccess(set, response, data, "Success: Customer Poral Loaded, you will be redirected shortly!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, serviceCreatePortalSession: false },
                }));
            }
        },
    }),
        {
            name: 'service-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    )
)
