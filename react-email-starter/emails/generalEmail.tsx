import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Link,
    Text,
    Hr,
    Section,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import { ActivationEmail } from "./activationEmail";
import brandingConfig from './brandingConfig.json';


export const GeneralEmail = ({ BodyEmailComponent, parameters }) => {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={`${brandingConfig.baseUrl}/logo.png`}
                                width="125"
                                height="125"
                                alt="Logo"
                                className="my-0 mx-auto rounded-3xl"
                            />
                        </Section>

                        <BodyEmailComponent {...parameters} />

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px] text-center">

                            <Link href={`${brandingConfig.baseUrl}/howitworks`} className="text-blue-600 mr-1 ml-1">
                                HowItWorks
                            </Link>
                            |
                            <Link href={`${brandingConfig.baseUrl}/terms`} className="text-blue-600 mr-1 ml-1">
                                Terms & Conditions
                            </Link>
                            |
                            <Link href={`${brandingConfig.baseUrl}/privacy`} className="text-blue-600 mr-1 ml-1">
                                Privacy Policy
                            </Link>
                        </Text>
                    </Container>
                    <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    <Text className="text-[#666666] text-[12px] leading-[24px]">
                        Copyright © {new Date().getFullYear().toString()} {brandingConfig.company_name}, All rights reserved.
                    </Text>
                    <Text className="text-[#666666] text-[12px] leading-[24px]">
                        {brandingConfig.company_name} {brandingConfig.company_location ? `is located at ${brandingConfig.company_location}`: ''}
                    </Text>
                    <Text className="text-[#666666] text-[12px] leading-[24px]">
                        If you have any questions, please contact {brandingConfig.info_email}
                    </Text>
                    <Text className="text-[#666666] text-[12px] leading-[24px]">

                        This email was sent to you because you created an Account on {brandingConfig.baseUrl} by agreeing to our
                        <Link href={`${brandingConfig.baseUrl}/terms`} className="text-blue-600 mr-1 ml-1">
                            T&C.
                        </Link>
                    </Text>
                </Body>
            </Tailwind>
        </Html >
    );
};

GeneralEmail.PreviewProps = {
    BodyEmailComponent: ActivationEmail,
    parameters: {
        firstName: brandingConfig.firstName,
        activationLink: brandingConfig.baseUrl
    }
};

export default GeneralEmail;
