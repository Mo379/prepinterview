import { useEffect, useRef, useState } from 'react';
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
import { SideBar } from './components/sidebar';
import { Home } from './pages/subpages_service/home';
import { JoinSpace, ShareSpace, Spaces, SpacesNewLesson } from './pages/subpages_service/spaces';
import HowItWorks from './pages/howitworks';
import { useStreamStore } from './stores/streamStore';
import { useSourceStore } from './stores/sourceStore';

import 'katex/dist/katex.min.css'
import 'highlight.js/styles/tokyo-night-dark.css'; // or another highlight.js theme
import { useNoteStore } from './stores/noteStore';
import { useGeneralTutorStore } from './stores/generalTutorStore';



function Layout(props: {
    toggle_body_style: any,
    mainBodyStyle: any,
    sidebar_display_style: any,
    toggle_sidebar_style: any,
    isMdScreen: any,
    sideBarWidth: any
}) {
    const { generalTutorLesson } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorLesson: state.generalTutorLesson,
        })),
    );

    const containerRef = useRef<HTMLDivElement | null>(null);
    const generalTutorLessonRef = useRef(generalTutorLesson);

    // Keep ref updated
    useEffect(() => {
        generalTutorLessonRef.current = generalTutorLesson;
    }, [generalTutorLesson]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onScroll = () => {
            const headings = Array.from(
                container.querySelectorAll<HTMLHeadingElement>('h1, h2, h3')
            );

            const containerBottom = container.getBoundingClientRect().bottom;

            let lowest: HTMLHeadingElement | null = null;
            let maxVisibleTop = -Infinity;

            headings.forEach((heading) => {
                const headingTop = heading.getBoundingClientRect().top;

                // Only consider headings within or above the visible container
                if (headingTop < containerBottom && headingTop > maxVisibleTop) {
                    maxVisibleTop = headingTop;
                    lowest = heading;
                }
            });

            if (lowest && generalTutorLessonRef.current && 'source' in generalTutorLessonRef.current) {
                const index = generalTutorLessonRef.current.source.content.outline.findIndex(
                    ([_, id]: any) => lowest && id === lowest.id
                );
                if (index !== -1) {
                    useGeneralTutorStore.setState({ closeHeadingIndex: index });
                }
            }
        };

        container.addEventListener('scroll', onScroll);

        // run once initially
        onScroll();

        return () => {
            container.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <div className="APP w-screen h-[100dvh]">
            <div className="flex md:flex-row-reverse !max-w-12/12 m-auto px-0 text-[9px] min-h-[100dvh] max-h-[100dvh] overflow-hidden">
                {/* Main Body */}
                <div
                    className={`${props.toggle_body_style} m-0 text-[9px] p-[0px] min-h-[100dvh] max-h-[100dvh]`}
                    style={props.mainBodyStyle}
                >
                    <div className="flex flex-row m-0 text-[9px] w-full h-auto">
                        <Header />
                    </div>
                    <div
                        className="flex flex-col px-0 text-[12px] h-full w-full overflow-scroll scrollbar-hide"
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
                {/* Sidebar */}
                <div
                    className={`
            ${props.sidebar_display_style}
            ${props.toggle_sidebar_style}
            m-0 p-0 text-[11px]
            bg-neutral-100 dark:bg-secondary/30
            min-h-[100dvh] max-h-[100dvh]
          `}
                    style={!props.isMdScreen ? { width: props.sideBarWidth } : { width: '90%' }}
                >
                    <div id="scrollableDiv" className="basis-12/12 overflow-scroll w-full h-full border-r border-primary/20 rounded-xl scrollbar-hide">
                        <SideBar />
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    const { appToast, appResetToast, appRouteTo, appResetRouteTo, appResetLoading, appShowSideBar, isMdScreen, setIsMdScreen, setShowSideBar } = useAppStore(
        useShallow((state) => ({
            appToast: state.toast,
            appResetToast: state.resetToast,
            appRouteTo: state.routeto,
            appResetRouteTo: state.resetRouteTo,
            appResetLoading: state.resetLoading,
            appShowSideBar: state.showSideBar,
            setShowSideBar: state.setShowSideBar,
            isMdScreen: state.isMdScreen,
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
    const { sourceToast, sourceResetToast, sourceRouteTo, sourceResetRouteTo, sourceResetLoading } = useSourceStore(
        useShallow((state) => ({
            sourceToast: state.toast,
            sourceResetToast: state.resetToast,
            sourceRouteTo: state.routeto,
            sourceResetRouteTo: state.resetRouteTo,
            sourceResetLoading: state.resetLoading,
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
    const sideBarWidth = 260
    const [mainBodyWidth, setMainBodyWidth] = useState(window.innerWidth - sideBarWidth);

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
        if (window.innerWidth <= mdScreenSize) {
            setShowSideBar(false)
        }

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
        sourceResetLoading()
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
        } else if (sourceToast) {
            toast(sourceToast)
            sourceResetToast()
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
        sourceToast,
        sourceResetToast,
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
        } else if (sourceRouteTo) {
            navigate(sourceRouteTo)
            sourceResetRouteTo()
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

        sourceResetRouteTo,
        sourceRouteTo,

        noteResetRouteTo,
        noteRouteTo,

    ]); // Empty dependency array means this effect will only run once, when the component mounts.
    // static params  and style
    useEffect(() => {
        const handleResize = () => setMainBodyWidth(window.innerWidth - sideBarWidth);

        // Attach resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener
        return () => window.removeEventListener('resize', handleResize);
    }, [sideBarWidth]);
    useEffect(() => {
        if (!auth.hid && appShowSideBar) {
            setShowSideBar(false)
        }
    }, [auth, appShowSideBar]);


    let sidebar_display_style = 'flex flex-col'
    let toggle_sidebar_style = `w-full md:!w-[${sideBarWidth}px] md:!min-w-[${sideBarWidth}px] md:!max-w-[${sideBarWidth}px]`
    let toggle_body_style = `hidden md:flex md:flex-col md:w-[${mainBodyWidth}px]`
    let mainBodyStyle: { width: string } | any = {
        width: `${mainBodyWidth}px`,
    };
    if (appShowSideBar === false) {
        sidebar_display_style = 'hidden'
        toggle_sidebar_style = ''
        toggle_body_style = 'flex flex-col w-full'
        mainBodyStyle = {}
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Layout
                        toggle_body_style={toggle_body_style}
                        mainBodyStyle={mainBodyStyle}
                        sidebar_display_style={sidebar_display_style}
                        toggle_sidebar_style={toggle_sidebar_style}
                        isMdScreen={isMdScreen}
                        sideBarWidth={sideBarWidth}
                    />
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
                        <Route path="/space" element={<Spaces />} />
                        <Route path="/new_reading" element={<SpacesNewLesson />} />
                        <Route path="/share_space/:space_name/:space_hid" element={<ShareSpace />} />
                        <Route path="/join_space/:space_name/:space_hid" element={<JoinSpace />} />
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
