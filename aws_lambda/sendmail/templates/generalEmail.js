"use strict";

var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = void 0 && (void 0).__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeneralEmail = void 0;
var components_1 = require("@react-email/components");
var tailwind_1 = require("@react-email/tailwind");
var React = __importStar(require("react"));
var activationEmail_1 = require("./activationEmail");
var brandingConfig_json_1 = __importDefault(require("./brandingConfig.json"));
var GeneralEmail = function GeneralEmail(_ref) {
  var BodyEmailComponent = _ref.BodyEmailComponent,
    parameters = _ref.parameters;
  return /*#__PURE__*/React.createElement(components_1.Html, null, /*#__PURE__*/React.createElement(components_1.Head, null), /*#__PURE__*/React.createElement(tailwind_1.Tailwind, null, /*#__PURE__*/React.createElement(components_1.Body, {
    className: "bg-white my-auto mx-auto font-sans px-2"
  }, /*#__PURE__*/React.createElement(components_1.Container, {
    className: "border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]"
  }, /*#__PURE__*/React.createElement(components_1.Section, {
    className: "mt-[32px]"
  }, /*#__PURE__*/React.createElement(components_1.Img, {
    src: "".concat(brandingConfig_json_1["default"].baseUrl, "/logo.png"),
    width: "125",
    height: "125",
    alt: "Logo",
    className: "my-0 mx-auto rounded-3xl"
  })), /*#__PURE__*/React.createElement(BodyEmailComponent, parameters), /*#__PURE__*/React.createElement(components_1.Hr, {
    className: "border border-solid border-[#eaeaea] my-[26px] mx-0 w-full"
  }), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-[#666666] text-[12px] leading-[24px] text-center"
  }, /*#__PURE__*/React.createElement(components_1.Link, {
    href: "".concat(brandingConfig_json_1["default"].baseUrl, "/howitworks"),
    className: "text-blue-600 mr-1 ml-1"
  }, "HowItWorks"), "|", /*#__PURE__*/React.createElement(components_1.Link, {
    href: "".concat(brandingConfig_json_1["default"].baseUrl, "/terms"),
    className: "text-blue-600 mr-1 ml-1"
  }, "Terms & Conditions"), "|", /*#__PURE__*/React.createElement(components_1.Link, {
    href: "".concat(brandingConfig_json_1["default"].baseUrl, "/privacy"),
    className: "text-blue-600 mr-1 ml-1"
  }, "Privacy Policy"))), /*#__PURE__*/React.createElement(components_1.Hr, {
    className: "border border-solid border-[#eaeaea] my-[26px] mx-0 w-full"
  }), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-[#666666] text-[12px] leading-[24px]"
  }, "Copyright \xA9 ", new Date().getFullYear().toString(), " ", brandingConfig_json_1["default"].company_name, ", All rights reserved."), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-[#666666] text-[12px] leading-[24px]"
  }, brandingConfig_json_1["default"].company_name, " ", brandingConfig_json_1["default"].company_location ? "is located at ".concat(brandingConfig_json_1["default"].company_location) : ''), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-[#666666] text-[12px] leading-[24px]"
  }, "If you have any questions, please contact ", brandingConfig_json_1["default"].info_email), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-[#666666] text-[12px] leading-[24px]"
  }, "This email was sent to you because you created an Account on ", brandingConfig_json_1["default"].baseUrl, " by agreeing to our", /*#__PURE__*/React.createElement(components_1.Link, {
    href: "".concat(brandingConfig_json_1["default"].baseUrl, "/terms"),
    className: "text-blue-600 mr-1 ml-1"
  }, "T&C.")))));
};
exports.GeneralEmail = GeneralEmail;
exports.GeneralEmail.PreviewProps = {
  BodyEmailComponent: activationEmail_1.ActivationEmail,
  parameters: {
    firstName: brandingConfig_json_1["default"].firstName,
    activationLink: brandingConfig_json_1["default"].baseUrl
  }
};
exports["default"] = exports.GeneralEmail;
