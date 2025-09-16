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
exports.AccountDeletionEmail = void 0;
const components_1 = require("@react-email/components");
const tailwind_1 = require("@react-email/tailwind");
const React = __importStar(require("react"));
const brandingConfig_json_1 = __importDefault(require("./brandingConfig.json"));
const AccountDeletionEmail = ({ firstName, }) => {
    return (<>
            <tailwind_1.Tailwind>
                <components_1.Text className="text-black text-[14px] leading-[24px]">
                    Hi {firstName},
                </components_1.Text>
                <components_1.Text className="text-black text-[14px] leading-[24px]">
                    Your account has been deleted successfully. We're sorry to see you go.
                </components_1.Text>
                <components_1.Text className="text-[#666666] text-[12px] leading-[24px]">
                    Thanks for using our service.
                </components_1.Text>
            </tailwind_1.Tailwind>
        </>);
};
exports.AccountDeletionEmail = AccountDeletionEmail;
exports.AccountDeletionEmail.PreviewProps = {
    firstName: brandingConfig_json_1.default.firstName,
};
exports.default = exports.AccountDeletionEmail;
