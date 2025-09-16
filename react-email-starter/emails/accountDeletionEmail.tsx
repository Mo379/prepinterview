import {
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import brandingConfig from './brandingConfig.json';

export const AccountDeletionEmail = ({
    firstName,
}) => {
    return (
        <>
            <Tailwind>
                <Text className="text-black text-[14px] leading-[24px]">
                    Hi {firstName},
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                    Your account has been deleted successfully. We're sorry to see you go.
                </Text>
                <Text className="text-[#666666] text-[12px] leading-[24px]">
                    Thanks for using our service.
                </Text>
            </Tailwind>
        </>
    )
}
AccountDeletionEmail.PreviewProps = {
    firstName: brandingConfig.firstName,
};
export default AccountDeletionEmail;
