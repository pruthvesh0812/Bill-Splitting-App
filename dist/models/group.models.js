"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groups = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const groupSchema = new mongoose_1.default.Schema({
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        }
    ],
    admin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
});
exports.Groups = mongoose_1.default.model("Groups", groupSchema);
