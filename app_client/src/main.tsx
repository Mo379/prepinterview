import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from "@/components/providers/themeprovider"
import ScrollToTop from './components/scrollToTop.tsx'
import { Toaster } from "@/components/ui/toaster"
import { PostHogProvider } from 'posthog-js/react'

const options = {
    api_host: (import.meta as any).env.VITE_PUBLIC_POSTHOG_HOST,
}



import './index.css'
import '@xyflow/react/dist/style.css';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <NextUIProvider locale="en-GB">
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <PostHogProvider
                        apiKey={(import.meta as any).env.VITE_PUBLIC_POSTHOG_KEY}
                        options={options}
                    >
                        <App />
                        <ScrollToTop />
                        <Toaster />
                    </PostHogProvider>
                </ThemeProvider>
            </NextUIProvider>
        </Router>
    </StrictMode>,
)
