"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tacher_interface_1 = require("../interface/tacher.interface");
const TacherSchem = new mongoose_1.default.Schema({
    tName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: [25, `Must be at least 25, got {age}`],
        max: [60, `Must be less then 60, got {age}`],
    },
    professionType: {
        type: tacher_interface_1.ProfessionEnum
    },
    idNum: {
        type: Number,
        require: true,
        unique: true
    }
}, { versionKey: false });
exports.default = mongoose_1.default.model('tachers', TacherSchem);
//# sourceMappingURL=tacher.model.js.map