"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationEmail = void 0;
const components_1 = require("@react-email/components");
const tailwind_1 = require("@react-email/tailwind");
const React = __importStar(require("react"));
const brandingConfig_json_1 = __importDefault(require("./brandingConfig.json"));
const ActivationEmail = ({ firstName, activationLink }) => {
    return (<>
            <tailwind_1.Tailwind>
                <components_1.Text className="text-black text-[14px] leading-[24px]">
                    Hi {firstName},
                </components_1.Text>
                <components_1.Text className="text-black text-[14px] leading-[24px]">
                    Please click on the link to confirm your account registration,
                </components_1.Text>
                <components_1.Section className="text-center mt-[32px] mb-[32px]">
                    <components_1.Button className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3" href={activationLink}>
                        Activate Your Account
                    </components_1.Button>
                </components_1.Section>
                <components_1.Text className="text-black text-[14px] leading-[24px]">
                    or copy and paste this URL into your browser:
                    <components_1.Text className="text-black text-[14px] leading-[24px]">
                        <components_1.Link href={activationLink} className="text-blue-600 no-underline">
                            {activationLink}
                        </components_1.Link>
                    </components_1.Text>
                </components_1.Text>
                <components_1.Text className="text-[#666666] text-[9px]">
                    This invitation was intended for <strong>{firstName}</strong>. If you
                    were not expecting this invitation, you can ignore this email. If
                    you are concerned about your account's safety, please reply to
                    this email to get in touch with us.
                </components_1.Text>
            </tailwind_1.Tailwind>
        </>);
};
exports.ActivationEmail = ActivationEmail;
exports.ActivationEmail.PreviewProps = {
    firstName: brandingConfig_json_1.default.firstName,
    activationLink: brandingConfig_json_1.default.baseUrl + '/<:token1>/<:token2>',
};
exports.default = exports.ActivationEmail;
