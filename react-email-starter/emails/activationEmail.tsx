import {
    Button,
    Link,
    Section,
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import brandingConfig from './brandingConfig.json';

export const ActivationEmail = ({
    firstName,
    activationLink
}) => {
    return (
        <>
            <Tailwind>
                <Text className="text-black text-[14px] leading-[24px]">
                    Hi {firstName},
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                    Please click on the link to confirm your account registration,
                </Text>
                <Section className="text-center mt-[32px] mb-[32px]">
                    <Button
                        className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                        href={activationLink}
                    >
                        Activate Your Account
                    </Button>
                </Section>
                <Text className="text-black text-[14px] leading-[24px]">
                    or copy and paste this URL into your browser:
                    <Text className="text-black text-[14px] leading-[24px]">
                        <Link href={activationLink} className="text-blue-600 no-underline">
                            {activationLink}
                        </Link>
                    </Text>
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
ActivationEmail.PreviewProps = {
    firstName: brandingConfig.firstName,
    activationLink: brandingConfig.baseUrl + '/<:token1>/<:token2>',
};
export default ActivationEmail;
