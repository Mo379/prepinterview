import { create } from 'zustand'
import { z } from 'zod';
import { persist, createJSONStorage } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode';
import { handleGeneralError, handleGeneralSuccess } from '@/functions/errors';
import { GoogleClientID } from './serviceStore';
import { APIURL } from './serviceStore';


const decodedTokenSchema = z.object({
    hid: z.union([z.string(), z.null()]),
    username: z.union([z.string(), z.null()]),
    firstname: z.union([z.string(), z.null()]),
    lastname: z.union([z.string(), z.null()]),
    email: z.union([z.string().email(), z.null()]),

    is_member: z.union([z.boolean(), z.null()]),
    accepted_terms: z.union([z.boolean(), z.null()]),
    authenticator: z.union([z.boolean(), z.null()]),

    stripeClientSecret: z.optional(z.union([z.string(), z.null()])),

    exp: z.optional(z.union([z.number(), z.null()])),
    iat: z.optional(z.union([z.number(), z.null()])),

    exp_access: z.optional(z.union([z.number(), z.null()])),
    iat_access: z.optional(z.union([z.number(), z.null()])),
    exp_refresh: z.optional(z.union([z.number(), z.null()])),
    iat_refresh: z.optional(z.union([z.number(), z.null()])),

    accessToken: z.optional(z.union([z.string(), z.null()])),
    refreshToken: z.optional(z.union([z.string(), z.null()])),

});

const captchaComponentSchema = z.object({
    getValue: z.function().returns(z.union([z.string(), z.null()])),
});

const userLoadingSchema = z.object({
    userLogin: z.boolean(),
    googleLogin: z.boolean(),
    userForgotPassword: z.boolean(),
    userSignup: z.boolean(),
    userOnBoarding: z.boolean(),
    userUpdateAccountInformation: z.boolean(),
    userResetPassword: z.boolean(),
    userActivation: z.boolean(),
    userContact: z.boolean(),
    userAcceptedTerms: z.boolean(),
    userLogout: z.boolean(),
    userAccountDeletion: z.boolean(),
    userUpdateToken: z.boolean(),
})


const userStateSchema = z.object({
    loading: userLoadingSchema,
    routeto: z.optional(z.union([z.string(), z.null()])),
    toast: z.any(),

    auth: decodedTokenSchema,

    resetRouteTo: z.function(),
    resetToast: z.function(),
    resetLoading: z.function(),
    setGoogleAuthResponse: z.function(),

    userContact: z.function(z.tuple([z.any(), z.string(), z.string()]), z.void()),
    userLogout: z.function(z.tuple([]), z.void()),
    userAccountDeletion: z.function(z.tuple([z.any(), z.string()]), z.void()),
    userLogin: z.function(z.tuple([z.any(), z.string(), z.string()]), z.void()),
    googleLogin: z.function(z.tuple([z.any()]), z.void()),
    userSignup: z.function(z.tuple([z.any(), z.string(), z.string(), z.string(), z.string()]), z.void()),
    userOnBoarding: z.function(z.tuple([z.any(), z.string(), z.string(), z.string(), z.boolean()]), z.void()),
    userUpdateAccountInformation: z.function(z.tuple([z.any(), z.string(), z.string(), z.string()]), z.void()),
    userForgotPassword: z.function(z.tuple([z.any(), z.string(), z.string()]), z.void()),
    userResetPassword: z.function(z.tuple([z.any(), z.string(), z.string(), z.string(), z.string()]), z.void()),
    userActivation: z.function(z.tuple([z.any(), z.string(), z.string()]), z.void()),
    userUpdateToken: z.function(z.tuple([z.string()]), z.void()),
    userGoogleAuthResponse: z.any()
})


export type decodedTokenType = z.infer<typeof decodedTokenSchema>
export type userType = z.infer<typeof userStateSchema>
export type captchaComponentType = z.infer<typeof captchaComponentSchema>

export const useUserStore = create(
    persist<userType>((set, get) => ({
        loading: {
            userLogin: false,
            googleLogin: false,
            userForgotPassword: false,
            userSignup: false,
            userOnBoarding: false,
            userUpdateAccountInformation: false,
            userResetPassword: false,
            userActivation: false,
            userContact: false,
            userAcceptedTerms: false,
            userLogout: false,
            userAccountDeletion: false,
            userUpdateToken: false,


        },
        routeto: null,
        auth: {

            hid: null,
            username: null,
            firstname: null,
            lastname: null,
            email: null,

            is_member: null,
            accepted_terms: null,
            authenticator: null,

            stripeClientSecret: null,

            exp_access: null, // token expiration dates
            iat_access: null, // token creation time
            exp_refresh: null, // token expiration dates
            iat_refresh: null, // token creation time

            accessToken: null,
            refreshToken: null,
        },
        toast: null,
        userGoogleAuthResponse: null,




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
        setGoogleAuthResponse: (data: any) => set({ userGoogleAuthResponse: data }),


        userContact: async (setError: any, subject: string, message: string) => {
            set((state) => ({
                loading: { ...state.loading, userContact: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/contact.json`,
                    {

                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(get().auth.accessToken),
                        },
                        body: JSON.stringify({
                            'messageSubject': subject,
                            'message': message,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Contact message Failed!')
                handleGeneralSuccess(set, response, data, 'Success: We got you message, check your email for a confirmation.', '/')
            } catch (error) {
                console.error(error);
            } finally {
                set((state) => ({
                    loading: { ...state.loading, userContact: false },
                }));
            }
        },
        userLogout: async () => {
            localStorage.clear();
            set((state) => ({
                auth: {
                    ...state.auth,
                    hid: null,
                    username: null,
                    firstname: null,
                    lastname: null,
                    email: null,
                    is_member: null,
                    accepted_terms: null,
                    authenticator: null,
                    stripeClientSecret: null,
                    exp_access: null,
                    iat_access: null,
                    exp_refresh: null,
                    iat_refresh: null,
                    accessToken: null,
                    refreshToken: null,

                },
            }))
            if (!get().auth.hid) {
                set(() => ({
                    toast:
                    {
                        title: "Success: Logged out!",
                    },
                    routeto: '/auth'
                }));
            }
            localStorage.clear();
        },
        userAccountDeletion: async (setError: any, password: string) => {
            set((state) => ({
                loading: { ...state.loading, userAccountDeletion: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                const response = await fetch(`${APIURL}/user/deleteaccount.json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(get().auth.accessToken),
                    },
                    body: JSON.stringify({
                        password: password,
                    }),
                });

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Account Deletion Failed!')
                get().userLogout()
                // Update Zustand store with the received tokens and user info
                handleGeneralSuccess(set, response, data, 'Success: Account deletion proccess started.', '/auth')
            } catch (error) {
                console.error(error);
                // Handle error by clearing sensitive data or showing an error state
            } finally {
                set((state) => ({
                    loading: { ...state.loading, userAccountDeletion: false },
                }));
            }
        },
        userLogin: async (setError: any, userName: string, password: string) => {
            set((state) => ({
                loading: { ...state.loading, userLogin: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                const response = await fetch(`${APIURL}/user/login.json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: userName,
                        password: password,
                    }),
                });

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Login Failed!')
                // Update Zustand store with the received tokens and user info
                let AccessTokenInformation: decodedTokenType = jwtDecode(data.access)
                let RefreshTokenInformation: decodedTokenType = jwtDecode(data.refresh)
                set((state) => ({
                    auth: {
                        ...state.auth,
                        hid: AccessTokenInformation.hid,
                        username: AccessTokenInformation.username,
                        firstname: AccessTokenInformation.firstname,
                        lastname: AccessTokenInformation.lastname,
                        is_member: AccessTokenInformation.is_member,
                        accepted_terms: AccessTokenInformation.accepted_terms,
                        authenticator: AccessTokenInformation.authenticator,
                        email: AccessTokenInformation.email,
                        exp_access: AccessTokenInformation.exp,
                        iat_access: AccessTokenInformation.iat,
                        exp_refresh: RefreshTokenInformation.exp,
                        iat_refresh: RefreshTokenInformation.iat,
                        accessToken: String(data.access),
                        refreshToken: String(data.refresh)
                    },
                }));
                handleGeneralSuccess(set, response, data, 'Success: logged in.', '/')
            } catch (error) {
                console.error(error);
                // Handle error by clearing sensitive data or showing an error state
                set((state) => ({
                    auth: {
                        ...state.auth,
                        hid: null,
                        username: null,
                        firstname: null,
                        lastname: null,
                        is_member: null,
                        accepted_terms: null,
                        authenticator: null,
                        email: null,
                        exp_access: null,
                        iat_access: null,
                        exp_refresh: null,
                        iat_refresh: null,
                        accessToken: null,
                        refreshToken: null,
                    }
                }));
            } finally {
                set((state) => ({
                    loading: { ...state.loading, userLogin: false },
                }));
            }
        },
        googleLogin: async (setError: any) => {
            set((state) => ({
                loading: { ...state.loading, googleLogin: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            google.accounts.id.initialize({
                client_id: GoogleClientID,
                callback: async (google_response: any) => {
                    try {
                        // Send a POST request to the login API
                        const googleToken = google_response.credential;
                        const response = await fetch(`${APIURL}/user/google_login.json`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ access_token: googleToken }),
                        });
                        const data = await response.json();

                        // check and report errors
                        handleGeneralError(setError, set, response, data, 'Login Failed!')
                        // Update Zustand store with the received tokens and user info
                        let AccessTokenInformation: decodedTokenType = jwtDecode(data.access)
                        let RefreshTokenInformation: decodedTokenType = jwtDecode(data.refresh)
                        set((state) => ({
                            auth: {
                                ...state.auth,
                                hid: AccessTokenInformation.hid,
                                username: AccessTokenInformation.username,
                                firstname: AccessTokenInformation.firstname,
                                lastname: AccessTokenInformation.lastname,
                                is_member: AccessTokenInformation.is_member,
                                accepted_terms: AccessTokenInformation.accepted_terms,
                                authenticator: AccessTokenInformation.authenticator,
                                email: AccessTokenInformation.email,
                                exp_access: AccessTokenInformation.exp,
                                iat_access: AccessTokenInformation.iat,
                                exp_refresh: RefreshTokenInformation.exp,
                                iat_refresh: RefreshTokenInformation.iat,
                                accessToken: String(data.access),
                                refreshToken: String(data.refresh)
                            },
                        }));
                        handleGeneralSuccess(set, response, data, 'Success: logged in.', '/')
                    } catch (error) {
                        console.error(error);
                        // Handle error by clearing sensitive data or showing an error state
                        set((state) => ({
                            auth: {
                                ...state.auth,
                                hid: null,
                                username: null,
                                firstname: null,
                                lastname: null,
                                is_member: null,
                                accepted_terms: null,
                                authenticator: null,
                                email: null,
                                exp_access: null,
                                iat_access: null,
                                exp_refresh: null,
                                iat_refresh: null,
                                accessToken: null,
                                refreshToken: null,
                            }
                        }));
                    } finally {
                        set((state) => ({
                            loading: { ...state.loading, googleLogin: false },
                        }));
                    }
                },
            });
            google.accounts.id.prompt();
        },
        userSignup: async (setError: any, email: string, password: string, config_password: string, captcha_token) => {
            set((state) => ({
                loading: { ...state.loading, userSignup: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/signup.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'email': email,
                            'password': password,
                            'confirmpassword': config_password,
                            'g-recaptcha-response': captcha_token,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'SignUp Failed!')

                handleGeneralSuccess(set, response, data, 'Success: Signed up!', '/auth')
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, userSignup: false },
                }));
            }
        },
        userOnBoarding: async (setError: any, username: string, firstname: string, lastname: string, acceptterms: boolean) => {
            set((state) => ({
                loading: { ...state.loading, userOnBoarding: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/onboarding.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(get().auth.accessToken),
                        },
                        body: JSON.stringify({
                            'username': username,
                            'firstname': firstname,
                            'lastname': lastname,
                            'accepted_terms': acceptterms,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'OnBoarding Failed!')
                set((state) => ({
                    auth: {
                        ...state.auth,
                        accepted_terms: true
                    },
                }));
                handleGeneralSuccess(set, response, data, "Success: You're Onboard!", '/')
            } catch (error) {
                console.error(error);
            } finally {
                set((state) => ({
                    loading: { ...state.loading, userOnBoarding: false },
                }));
            }
        },
        userUpdateAccountInformation: async (setError: any, firstname: string, lastname: string, username: string) => {
            set((state) => ({
                loading: { ...state.loading, userUpdateAccountInformation: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/account_information_update.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(get().auth.accessToken),
                        },
                        body: JSON.stringify({
                            'firstname': firstname,
                            'lastname': lastname,
                            'username': username,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Update Failed!')
                set((state) => ({
                    auth: {
                        ...state.auth,
                        firstname: firstname,
                        lastname: lastname,
                        username: username,
                    },
                }));
                handleGeneralSuccess(set, response, data, "Success: Account information upated!", null)
            } catch (error) {
                console.error(error);
            } finally {
                set((state) => ({
                    loading: { ...state.loading, userUpdateAccountInformation: false },
                }));
            }
        },
        userForgotPassword: async (setError: any, username: string, captcha_token: string) => {
            set((state) => ({
                loading: { ...state.loading, userForgotPassword: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/password_reset_trigger.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'username': username,
                            'g-recaptcha-response': captcha_token,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Forgot Password Failed!')

                handleGeneralSuccess(set, response, data, "Success: Reset process started!", '/auth')
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, userForgotPassword: false },
                }));
            }
        },
        userResetPassword: async (setError: any, password: string, confirmpassword: string, uidb64: string, token: string) => {
            set((state) => ({
                loading: { ...state.loading, userResetPassword: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/password_reset_return.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'uidb64': uidb64,
                            'token': token,
                            'password': password,
                            'confirmpassword': confirmpassword,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Password Reset Failed!')

                handleGeneralSuccess(set, response, data, "Success: Password reset successful!", '/auth')
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, userResetPassword: false },
                }));
            }
        },
        userActivation: async (setError: any, uidb64: string, token: string) => {
            set((state) => ({
                loading: { ...state.loading, userActivation: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/activate.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'uidb64': uidb64,
                            'token': token,
                        })
                    }
                )

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(setError, set, response, data, 'Activation Failed!')

                handleGeneralSuccess(set, response, data, "Success: Your account is activated!", '/auth')
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, userActivation: false },
                }));
            }
        },
        userUpdateToken: async (refreshToken: string) => {
            set((state) => ({
                loading: { ...state.loading, userUpdateToken: true },
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
                // Send a POST request to the login API
                let response = await fetch(
                    `${APIURL}/user/re_login.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'refresh': refreshToken,
                        })
                    })

                // Parse the response JSON
                const data = await response.json();

                // check and report errors
                handleGeneralError(() => { }, set, response, data, 'Update Login Failed!')

                // Update Zustand store with the received tokens and user info
                let AccessTokenInformation: decodedTokenType = jwtDecode(data.access)
                set((state) => ({
                    auth: {
                        ...state.auth,
                        hid: AccessTokenInformation.hid,
                        username: AccessTokenInformation.username,
                        is_member: AccessTokenInformation.is_member,
                        accepted_terms: AccessTokenInformation.accepted_terms,
                        authenticator: AccessTokenInformation.authenticator,
                        email: AccessTokenInformation.email,
                        exp_access: AccessTokenInformation.exp,
                        iat_access: AccessTokenInformation.iat,
                        accessToken: String(data.access),
                    },
                }));

                handleGeneralSuccess(set, response, data, "Success: Token updated!", null)
            } catch (error) {
                console.error(error);
            } finally {
                // Reset loading.userLogin to false
                set((state) => ({
                    loading: { ...state.loading, userUpdateToken: false },
                }));
            }
        },
    }),
        {
            name: 'user-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    )
)
