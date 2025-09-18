import { BriefcaseBusiness } from "lucide-react"
import { useShallow } from "zustand/shallow"
import { UserProfileItem } from "./subcomponents"
import { useUserStore } from "@/stores/userStore"
import { useNavigate } from "react-router-dom"

function Header() {
    const { auth } = useUserStore(
        useShallow((state) => ({
            auth: state.auth,
        })),
    )
    const navigate = useNavigate()


    return (
        <>
            <div className='flex flex-row justify-between w-full p-2 z-50 bg-background'>
                {auth.hid ? (
                    <div
                        className={`p-1 w-4/4 flex items-center font-bold text-center
                        float-right
                        text-xl
                        basis-6/12
                    `}
                    >
                        <div className='flex flex-col hover:cursor-pointer'
                            onClick={() => {
                                navigate('/')
                            }}
                        >
                            <BriefcaseBusiness size={45} strokeWidth={1.75} absoluteStrokeWidth className='m-auto' />
                            <span className='m-auto text-[9px]'>PrepInterview</span>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col p-2 hover:cursor-pointer'
                        onClick={() => {
                            navigate('/')
                        }}
                    >
                        <BriefcaseBusiness size={45} strokeWidth={1.75} absoluteStrokeWidth className='m-auto w-[60px] h-[60px]' />
                    </div>
                )}
                <div className='basis-6/12'>
                    <div className='w-full flex !flex-row-reverse'>
                        <UserProfileItem />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
