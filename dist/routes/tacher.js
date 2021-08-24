"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tacher_model_1 = __importDefault(require("../models/tacher.model"));
const router = express_1.default.Router();
router.post('/api/tacher/newTacher', async (req, res) => {
    const tacher = new tacher_model_1.default({
        tName: req.body.tName,
        ages: req.body.age,
        professionType: req.body.professionType,
        idNum: req.body.idNum
    });
    try {
        const newtacher = await tacher.save();
        res.status(201).json(newtacher);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=tacher.js.map