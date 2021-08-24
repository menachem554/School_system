"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tacherSchema = new mongoose_1.default.Schema({
    sName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: [12, `Must be at least 12, got {age}`],
        max: [20, `Must be less then 20, got {age}`],
    },
    averageGrade: {
        type: Number,
    },
    tacherID: {
        type: Number,
        require: true,
        unique: true,
    },
    studentNum: {
        type: Number,
        require: true,
        unique: true,
    },
}, { versionKey: false });
exports.default = mongoose_1.default.model('studens', tacherSchema);
//# sourceMappingURL=student.model.js.map