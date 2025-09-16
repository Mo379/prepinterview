import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Smooth scrolling
        });
    }, [pathname]);

    return null; // This component doesn't render anything
};

export const ScrollToBottom: any = (elementRef: any) => {
    const { pathname } = useLocation();

    useEffect(() => {
        const el = elementRef.current;
        if (el) {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [pathname, elementRef]);

    return null;
};
export const ScrollBottomChatPage = () => {
    // find the nearest ancestor with .js-scroll-container
    const container = document.getElementById("chat_page_top");
    if (container) {
        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    }
};
export const ScrollTopChatPage = () => {
    // find the element with ID 'chat_page_top'
    const container = document.getElementById("chat_page_top");
    if (container) {
        container.scrollTo({
            top: 0,
            behavior: "instant", // or "auto" for instant scroll
        });
    }
};

export default ScrollToTop;
