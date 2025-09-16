import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function CookiePolicy() {
    //
    return (
        <>
            <div className='text-sm  dark:prose-invert m-auto text-center mt-4'>
                <h1 className='m-auto text-center mb-8 w-full'>
                    Cookie Policy
                </h1>
                <div className='w-full flex flex-col md:flex-row justify-center mt-4 gap-4'>
                    <Card className="w-[80%] m-auto ">
                        <CardHeader>
                            <CardTitle className='underline text-success'></CardTitle>
                            <CardDescription>
                                <p className="text-sm mb-6">Effective Date: <span className="font-medium">28/Dec/2024</span></p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4 border-success max-w-prose prose prose-slate prose-sm m-auto">
                                <div className="">

                                    <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                                    <p className="mb-4">This Cookie Policy explains how <span className="font-medium">[Your Company Name]</span> ("we," "our," "us") uses cookies and similar technologies to recognize you when you visit our website at <span className="font-medium">[Website URL]</span> ("Website"). It explains what these technologies are, why we use them, and your rights to control their use.</p>

                                    <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
                                    <p className="mb-4">Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>

                                    <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
                                    <ul className="list-disc list-inside mb-4">
                                        <li className="mb-2">
                                            <strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually set only in response to actions you take, such as setting your privacy preferences, logging in, or filling out forms.
                                        </li>
                                        <li className="mb-2">
                                            <strong>Performance and Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information these cookies collect is aggregated and therefore anonymous.
                                        </li>
                                        <li className="mb-2">
                                            <strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                                        </li>
                                        <li className="mb-2">
                                            <strong>Advertising Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show relevant ads on other sites.</li>
                                    </ul>

                                    <h2 className="text-2xl font-semibold mb-4">4. How Long Do Cookies Last?</h2>
                                    <p className="mb-4">Cookies can remain on your device for different periods of time:</p>
                                    <ul className="list-disc list-inside mb-4">
                                        <li className="mb-2">
                                            <strong>Session Cookies:</strong> These cookies last only as long as your online session and disappear from your device when you close your browser.
                                        </li>
                                        <li className="mb-2">
                                            <strong>Persistent Cookies:</strong> These cookies remain on your device after you close your browser and can be used again when you return to the site.
                                        </li>
                                    </ul>

                                    <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
                                    <p className="mb-4">You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas may be restricted.</p>

                                    <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
                                    <p className="mb-4">We may update this Cookie Policy from time to time to reflect changes in our practices, technologies, or legal requirements. The updated version will be indicated by an updated "Effective Date."</p>

                                </div>


                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default CookiePolicy
