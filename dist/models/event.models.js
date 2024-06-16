"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    eventName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paidByUser: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        }
    ],
    status: {
        type: String,
        enum: ['OPEN', "CLOSE"],
        required: true
    }
});
exports.Events = mongoose_1.default.model("Events", eventSchema);
