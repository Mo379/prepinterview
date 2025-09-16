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
exports.WelcomeEmail = void 0;
var components_1 = require("@react-email/components");
var tailwind_1 = require("@react-email/tailwind");
var React = __importStar(require("react"));
var brandingConfig_json_1 = __importDefault(require("./brandingConfig.json"));
var WelcomeEmail = function WelcomeEmail(_ref) {
  var firstName = _ref.firstName;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(tailwind_1.Tailwind, null, /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-black text-[24px] leading-[24px] text-center"
  }, /*#__PURE__*/React.createElement("strong", null, "Welcome to ", brandingConfig_json_1["default"].app_name, "!")), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-black text-[14px] text-center"
  }, /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-black text-[14px] text-center"
  }, "Hi ", firstName, ", We're excited to welcome you to the community!"), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-black text-[14px] text-center"
  }, brandingConfig_json_1["default"].sub_catch_phrase), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-black text-[14px] text-center"
  }, /*#__PURE__*/React.createElement("strong", null, brandingConfig_json_1["default"].catch_phrase))), /*#__PURE__*/React.createElement(components_1.Section, {
    className: "text-center mt-[32px] mb-[32px]"
  }, /*#__PURE__*/React.createElement(components_1.Button, {
    className: "bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3",
    href: brandingConfig_json_1["default"].baseUrl
  }, "Start Learning Now"))));
};
exports.WelcomeEmail = WelcomeEmail;
exports.WelcomeEmail.PreviewProps = {
  firstName: brandingConfig_json_1["default"].firstName
};
exports["default"] = exports.WelcomeEmail;
