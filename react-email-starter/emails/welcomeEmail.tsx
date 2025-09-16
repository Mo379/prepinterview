import {
    Button,
    Section,
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import brandingConfig from './brandingConfig.json';

export const WelcomeEmail = ({
    firstName,
}) => {
    return (
        <>
            <Tailwind>
                <Text className="text-black text-[24px] leading-[24px] text-center">
                    <strong>Welcome to {brandingConfig.app_name}!</strong>
                </Text>
                <Text className="text-black text-[14px] text-center">
                    <Text className="text-black text-[14px] text-center">
                        Hi {firstName}, We're excited to welcome you to the community!
                    </Text>
                    <Text className="text-black text-[14px] text-center">
                        {brandingConfig.sub_catch_phrase}
                    </Text>
                    <Text className="text-black text-[14px] text-center">
                        <strong>
                            {brandingConfig.catch_phrase}
                        </strong>
                    </Text>
                </Text>
                <Section className="text-center mt-[32px] mb-[32px]">
                    <Button
                        className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                        href={brandingConfig.baseUrl}
                    >
                        Start Learning Now
                    </Button>
                </Section>
            </Tailwind>
        </>
    )
}
WelcomeEmail.PreviewProps = {
    firstName: brandingConfig.firstName,
};
export default WelcomeEmail;
