import {
    Button,
    Link,
    Section,
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import brandingConfig from './brandingConfig.json';

export const PasswordResetEmail = ({
    firstName,
    userName,
    resetLink
}) => {
    return (
        <>
            <Tailwind>
                <Text className="text-black text-[14px] leading-[24px]">
                    Hi {firstName},
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                    Please click on the link to to reset your password,
                </Text>
                <Section className="text-center mt-[32px] mb-[32px]">
                    <Button
                        className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                        href={resetLink}
                    >
                        Reset Your Password
                    </Button>
                </Section>
                <Text className="text-black text-[14px] leading-[24px]">
                    or copy and paste this URL into your browser:
                    <Text className="text-black text-[14px] leading-[24px]">
                        <Link href={resetLink} className="text-blue-600 no-underline">
                            {resetLink}
                        </Link>
                    </Text>
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                    and in case you've forgotten, your username is: ({ userName }) or simply use your email to login.
                    Please Note, this password reset link is only active for a very short period,
                    if it does not work please start the process again.
                </Text>
                <Text className="text-[#666666] text-[9px]">
                    This invitation was intended for <strong>{firstName}</strong>. If you
                    were not expecting this invitation, you can ignore this email. If
                    you are concerned about your account's safety, please reply to
                    this email to get in touch with us.
                </Text>
            </Tailwind>
        </>
    )
}
PasswordResetEmail.PreviewProps = {
    firstName: brandingConfig.firstName,
    userName: brandingConfig.userName,
    resetLink: brandingConfig.baseUrl + '/reset/<:token1>/<:token2>',
};
export default PasswordResetEmail;
