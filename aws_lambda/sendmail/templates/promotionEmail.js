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
exports.PromotionEmail = void 0;
var components_1 = require("@react-email/components");
var tailwind_1 = require("@react-email/tailwind");
var React = __importStar(require("react"));
var brandingConfig_json_1 = __importDefault(require("./brandingConfig.json"));
var PromotionEmail = function PromotionEmail(_ref) {
  var firstName = _ref.firstName;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(tailwind_1.Tailwind, null, /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-black text-[14px] leading-[24px]"
  }, "Hi ", firstName, ","), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-[#666666] text-[9px]"
  }, "This is a promotional Email"), /*#__PURE__*/React.createElement(components_1.Text, {
    className: "text-[#666666] text-[12px] leading-[24px]"
  }, "Want to change how you receive these emails? You can", /*#__PURE__*/React.createElement(components_1.Link, {
    href: "".concat(brandingConfig_json_1["default"].baseUrl, "/promotionUnsubscribe/").concat(brandingConfig_json_1["default"].userName),
    className: "text-blue-600 mr-1 ml-1"
  }, "unsubscribe"), "from this list.")));
};
exports.PromotionEmail = PromotionEmail;
exports.PromotionEmail.PreviewProps = {
  firstName: brandingConfig_json_1["default"].firstName,
  userName: brandingConfig_json_1["default"].userName
};
exports["default"] = exports.PromotionEmail;
