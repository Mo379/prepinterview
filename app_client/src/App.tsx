import { useEffect, useRef } from 'react';
import { Route, Routes, useNavigate, Outlet } from 'react-router-dom'
import { useUserStore } from './stores/userStore';
import { useShallow } from 'zustand/react/shallow'
import Login from './pages/subpages_authentication/login';
import SignUp from './pages/subpages_authentication/signup';
import Settings from './pages/subpages_account/settings';
import Billing from './pages/subpages_account/billing';
import ResetPassword from './pages/subpages_authentication/resetpassword';
import ForgotPassword from './pages/subpages_authentication/forgotpassword';
import AccountDelete from './pages/subpages_authentication/accountdelete';
import AccountActivation from './pages/subpages_authentication/accountactivation';
import Header from './components/header';
import { mdScreenSize, useAppStore } from './stores/appStore';
import PrivateRoute, { InversePrivateRoute, OnBoardPrivateRoute } from './components/privateroute';
import CookieConsent from './components/cookieconcent';
import TCPolicy from './pages/policies/tandc';
import PrivacyPolicy from './pages/policies/privacy';
import CookiePolicy from './pages/policies/cookies';
import OnBoarding from './pages/subpages_authentication/onboarding';
import { useToast } from './hooks/use-toast';
import About from './pages/about';
import Contact from './pages/contact';
import Pricing from './pages/pricing';
import { useServiceStore } from './stores/serviceStore';
import { CheckOutSuccess } from './pages/subpages_account/checkoutsuccess';
import { Home } from './pages/subpages_service/home';
import { Spaces } from './pages/subpages_service/spaces';
import HowItWorks from './pages/howitworks';
import { useStreamStore } from './stores/streamStore';

import 'katex/dist/katex.min.css'
import 'highlight.js/styles/tokyo-night-dark.css'; // or another highlight.js theme
import { useNoteStore } from './stores/noteStore';



function Layout() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    // Keep ref updated
    return (
        <div className="APP w-screen h-[100dvh]">
            <div className="flex md:flex-row-reverse !max-w-12/12 m-auto px-0 text-[9px] min-h-[100dvh] max-h-[100dvh] overflow-hidden">
                {/* Main Body */}
                <div
                    className={`w-full m-0 text-[9px] p-[0px] min-h-[100dvh] max-h-[100dvh]`}
                >
                    <div className="flex flex-row m-0 text-[9px] w-full h-auto">
                        <Header />
                    </div>
                    <div
                        className="flex flex-col px-0 text-[12px] h-[85vh] w-full overflow-scroll scrollbar-hide"
                        id="chat_page_top"
                        ref={containerRef}
                    >
                        {/* This is where the route-specific content will render */}
                        <Outlet />
                    </div>
                    <div className="flex flex-row m-0 p-0 text-[9px] w-full relative">
                        <CookieConsent />
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    const { appToast, appResetToast, appRouteTo, appResetRouteTo, appResetLoading, setIsMdScreen } = useAppStore(
        useShallow((state) => ({
            appToast: state.toast,
            appResetToast: state.resetToast,
            appRouteTo: state.routeto,
            appResetRouteTo: state.resetRouteTo,
            appResetLoading: state.resetLoading,
            setIsMdScreen: state.setIsMdScreen,
        })),
    )
    const { userToast, userResetToast, userRouteTo, userResetRouteTo, userResetLoading, userLogout, userUpdateToken, auth } = useUserStore(
        useShallow((state) => ({
            userToast: state.toast,
            userResetToast: state.resetToast,
            userRouteTo: state.routeto,
            userResetRouteTo: state.resetRouteTo,
            userResetLoading: state.resetLoading,
            auth: state.auth,

            userLogin: state.userLogin,
            userLogout: state.userLogout,
            userUpdateToken: state.userUpdateToken
        })),
    )
    const { streamToast, streamResetToast, streamRouteTo, streamResetRouteTo, streamResetLoading } = useStreamStore(
        useShallow((state) => ({
            streamToast: state.toast,
            streamResetToast: state.resetToast,
            streamRouteTo: state.routeto,
            streamResetRouteTo: state.resetRouteTo,
            streamResetLoading: state.resetLoading,
        })),
    )
    const { noteToast, noteResetToast, noteRouteTo, noteResetRouteTo, noteResetLoading } = useNoteStore(
        useShallow((state) => ({
            noteToast: state.toast,
            noteResetToast: state.resetToast,
            noteRouteTo: state.routeto,
            noteResetRouteTo: state.resetRouteTo,
            noteResetLoading: state.resetLoading,
        })),
    )
    const { serviceToast, serviceResetToast, serviceRouteTo, serviceResetRouteTo, serviceResetLoading } = useServiceStore(
        useShallow((state) => ({
            serviceToast: state.toast,
            serviceResetToast: state.resetToast,
            serviceRouteTo: state.routeto,
            serviceResetRouteTo: state.resetRouteTo,
            serviceResetLoading: state.resetLoading,
        })),
    )

    const navigate = useNavigate()
    const { toast } = useToast()

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            const width = window.innerWidth;

            if (width <= mdScreenSize) {
                setIsMdScreen(true);
            } else {
                setIsMdScreen(false);
            }
        }

        // Set up
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        const runFunction = () => {
            if (
                auth.accessToken && auth.refreshToken
            ) {
                const timestamp = Math.floor(Date.now() / 1000)
                if (
                    auth.refreshToken && typeof auth.refreshToken == 'string' &&
                    auth.exp_refresh &&
                    auth.exp_access &&
                    auth.exp_refresh > timestamp
                ) {
                    // Uncomment for testing
                    //toast({
                    //    title: 'token',
                    //    description: `now: ${timestamp}, exp: ${auth.exp_refresh}, ${auth.exp_refresh - timestamp}, ${auth.exp_access - timestamp}`,
                    //    variant: 'default'
                    //})
                    if (
                        auth.exp_access < timestamp
                    ) {
                        userUpdateToken(
                            auth.refreshToken
                        )
                    }
                } else {
                    userLogout()
                }
            }
        };
        // Set up the interval
        const intervalId = setInterval(runFunction, 2000); // 5000 ms = 5 seconds
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [auth, userLogout, userUpdateToken]); // Empty dependency array means this effect will only run once, when the component mounts.

    useEffect(() => { // this will reset the loading states on refresh
        appResetLoading()
        userResetLoading()
        serviceResetLoading()
        streamResetLoading()
        noteResetLoading()
    }, []); // Empty dependency array means this effect will only run once, when the component mounts.

    useEffect(() => { // this will re-route using the state
        if (userToast) {
            toast(userToast)
            userResetToast()
        } else if (serviceToast) {
            toast(serviceToast)
            serviceResetToast()
        } else if (appToast) {
            toast(appToast)
            appResetToast()
        } else if (streamToast) {
            toast(streamToast)
            streamResetToast()
        } else if (noteToast) {
            toast(noteToast)
            noteResetToast()
        }
    }, [
        userToast,
        userResetToast,
        serviceToast,
        serviceResetToast,
        appToast,
        appResetToast,
        streamToast,
        streamResetToast,
        noteToast,
        noteResetToast,
    ]); // Empty dependency array means this effect will only run once, when the component mounts.


    useEffect(() => { // this will trigger toasts
        if (userRouteTo) {
            navigate(userRouteTo)
            userResetRouteTo()
        } else if (serviceRouteTo) {
            navigate(serviceRouteTo)
            serviceResetRouteTo()
        } else if (appRouteTo) {
            navigate(appRouteTo)
            appResetRouteTo()
        } else if (streamRouteTo) {
            navigate(streamRouteTo)
            streamResetRouteTo()
        } else if (noteRouteTo) {
            navigate(noteRouteTo)
            noteResetRouteTo()
        }
    }, [
        userRouteTo,
        userResetRouteTo,
        serviceRouteTo,
        serviceResetRouteTo,
        appRouteTo,
        appResetRouteTo,

        streamResetRouteTo,
        streamRouteTo,

        noteResetRouteTo,
        noteRouteTo,

    ]); // Empty dependency array means this effect will only run once, when the component mounts.
    // static params  and style


    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Layout/>
                }
            >
                {/* Define all your nested routes here */}
                <Route path="checkout_success" element={<CheckOutSuccess />} />

                <Route element={<PrivateRoute redirectTo="/auth" />}>
                    <Route path="onboarding" element={<OnBoarding />} />
                </Route>

                <Route element={<OnBoardPrivateRoute />}>
                    <Route path="pricing" element={<Pricing />} />
                    <Route path='/howitworks' element={<HowItWorks />} />

                    <Route path="about" element={<About />} />
                    <Route path="terms" element={<TCPolicy />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="cookies" element={<CookiePolicy />} />
                    <Route path="auth/reset_password/:uidb64/:activationToken" element={<ResetPassword />} />
                    <Route path="auth/delete_account" element={<AccountDelete />} />

                    <Route element={<InversePrivateRoute redirectTo="/" />}>
                        <Route path="auth" element={<Login />} />
                        <Route path="auth/login" element={<Login />} />
                        <Route path="auth/signup" element={<SignUp />} />
                        <Route path="auth/account_activation/:uidb64/:activationToken" element={<AccountActivation />} />
                        <Route path="auth/forgot_password" element={<ForgotPassword />} />
                    </Route>

                    <Route element={<PrivateRoute redirectTo="/howitworks" />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/case" element={<Spaces />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="account" element={<Settings />} />
                        <Route path="account/settings" element={<Settings />} />
                    </Route>
                    <Route path="account/billing" element={<Billing />} />

                    {/* Catch-all route */}
                    <Route path="*" element={<HowItWorks />} />
                </Route>
            </Route>
        </Routes>
    );
}




export default App
