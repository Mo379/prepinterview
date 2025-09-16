import {
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import brandingConfig from './brandingConfig.json';

export const ContactConfirmationEmail= ({
    firstName,
}) => {
    return (
        <>
            <Tailwind>
                <Text className="text-black text-[14px] leading-[24px]">
                    Hi {firstName},
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                    This is a confirmation email to let you know that we have recieved your
                    contact email and we will be back to you shortly.
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                    Thanks.
                </Text>
            </Tailwind>
        </>
    )
}
ContactConfirmationEmail.PreviewProps = {
    firstName: brandingConfig.firstName,
};
export default ContactConfirmationEmail;
