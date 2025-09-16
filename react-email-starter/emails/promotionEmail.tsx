import {
    Text,
    Link,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import brandingConfig from './brandingConfig.json';

export const PromotionEmail = ({
    firstName,
}) => {
    return (
        <>
            <Tailwind>
                <Text className="text-black text-[14px] leading-[24px]">
                    Hi {firstName},
                </Text>
                <Text className="text-[#666666] text-[9px]">
                    This is a promotional Email
                </Text>
                <Text className="text-[#666666] text-[12px] leading-[24px]">
                    Want to change how you receive these emails?
                    You can
                    <Link href={`${brandingConfig.baseUrl}/promotionUnsubscribe/${brandingConfig.userName}`} className="text-blue-600 mr-1 ml-1">
                        unsubscribe
                    </Link>
                    from this list.
                </Text>
            </Tailwind>
        </>
    )
}
PromotionEmail.PreviewProps = {
    firstName: brandingConfig.firstName,
    userName: brandingConfig.userName,
};
export default PromotionEmail;
