import { HIW_Pricing } from "../howitworks/HIW_Pricing"
function Billing() {

    return (
        <>
            <div className='flex flex-col md:flex-row h-fit'>
                <div className="flex flex-col w-full h-full items-center justify-center p-6">
                    <h1 className='text-4xl m-auto'> Billing </h1>
                    <HIW_Pricing />
                </div>
            </div>
        </>
    )
}

export default Billing
