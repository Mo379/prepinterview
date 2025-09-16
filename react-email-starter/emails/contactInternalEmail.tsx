import {
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import brandingConfig from './brandingConfig.json';

export const ContactInternalEmail= ({
    firstName,
    email,
    messageSubject,
    message
}) => {
    return (
        <>
            <Tailwind>
                <Text className="text-black text-[24px] leading-[24px] text-center">
                    <strong>{messageSubject}</strong>
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                    Hi, this is a contact email from {firstName} (email: {email})
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                    {message}
                </Text>
            </Tailwind>
        </>
    )
}
ContactInternalEmail.PreviewProps = {
    firstName: brandingConfig.firstName,
    email: brandingConfig.userEmail,
    messageSubject: 'Testing Contact',
    message: 'This is just me testing the contact email. When users contact, we see this.'
};
export default ContactInternalEmail;
