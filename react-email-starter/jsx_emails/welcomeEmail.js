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
exports.WelcomeEmail = void 0;
const components_1 = require("@react-email/components");
const tailwind_1 = require("@react-email/tailwind");
const React = __importStar(require("react"));
const brandingConfig_json_1 = __importDefault(require("./brandingConfig.json"));
const WelcomeEmail = ({ firstName, }) => {
    return (<>
            <tailwind_1.Tailwind>
                <components_1.Text className="text-black text-[24px] leading-[24px] text-center">
                    <strong>Welcome to {brandingConfig_json_1.default.app_name}!</strong>
                </components_1.Text>
                <components_1.Text className="text-black text-[14px] text-center">
                    <components_1.Text className="text-black text-[14px] text-center">
                        Hi {firstName}, We're excited to welcome you to the community!
                    </components_1.Text>
                    <components_1.Text className="text-black text-[14px] text-center">
                        {brandingConfig_json_1.default.sub_catch_phrase}
                    </components_1.Text>
                    <components_1.Text className="text-black text-[14px] text-center">
                        <strong>
                            {brandingConfig_json_1.default.catch_phrase}
                        </strong>
                    </components_1.Text>
                </components_1.Text>
                <components_1.Section className="text-center mt-[32px] mb-[32px]">
                    <components_1.Button className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3" href={brandingConfig_json_1.default.baseUrl}>
                        Start Learning Now
                    </components_1.Button>
                </components_1.Section>
            </tailwind_1.Tailwind>
        </>);
};
exports.WelcomeEmail = WelcomeEmail;
exports.WelcomeEmail.PreviewProps = {
    firstName: brandingConfig_json_1.default.firstName,
};
exports.default = exports.WelcomeEmail;
