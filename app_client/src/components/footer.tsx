import { CircleHelp, Mail, Cookie, Lock, MessageCircleQuestion, Handshake } from "lucide-react"
import { useNavigate } from "react-router-dom"
"use client"

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



function Footer() {
    const navigate = useNavigate()

    return (
        <>
            <DropdownMenu >
                <DropdownMenuTrigger asChild className='fixed bottom-4 right-4 rounded-full hidden md:block'>
                    <Button >
                        <CircleHelp size={50} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Contact</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => navigate('/contact')}
                        className="flex flex-row gap-2 ml-4 cursor-pointer mb-2 text-ring hover:text-primary text-sm mt-2"
                    >
                        <Mail size={20} className='mt-auto mb-auto' /> <span className="mt-auto mb-auto" >Email </span>
                    </DropdownMenuItem>
                    <DropdownMenuLabel>Legal</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => navigate('/terms')}
                        className="flex flex-row gap-2 ml-4 cursor-pointer mb-2 text-ring hover:text-primary text-smmt-2"
                    >
                        <Handshake size={20} className='mt-auto mb-auto' /> <span className="mt-auto mb-auto" >T&C</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => navigate('/privacy')}
                        className="flex flex-row gap-2 ml-4 cursor-pointer mb-2 text-ring hover:text-primary text-sm"
                    >
                        <Lock size={20} className='mt-auto mb-auto' /> <span className="mt-auto mb-auto" >Privacy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => navigate('/cookies')}
                        className="flex flex-row gap-2 ml-4 cursor-pointer mb-2 text-ring hover:text-primary text-sm"
                    >
                        <Cookie size={20} className='mt-auto mb-auto' /> <span className="mt-auto mb-auto" >Cookies</span>
                    </DropdownMenuItem>
                    <DropdownMenuLabel>Company</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => navigate('/about')}
                        className="flex flex-row gap-2 ml-4 cursor-pointer mb-2 text-ring hover:text-primary text-sm mt-2"
                    >
                        <MessageCircleQuestion size={20} className='mt-auto mb-auto' /> <span className="mt-auto mb-auto" >About</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default Footer
