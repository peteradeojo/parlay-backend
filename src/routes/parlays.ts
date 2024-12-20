import express from "express";
import ParlayController from "../controllers/parlays.controller";
import { validateSchema } from "../middleware/validate";
import Joi from "joi";

const router = express.Router();

export default () => {
	router.get("/", async (req, res) => {
        const parlays = await new ParlayController().getUserParlays(req.user!.id);
        res.json(parlays);
        return;
    });
	
    router.get("/top", async (req, res) => {
		const parlays = await new ParlayController().getTopParlays();
		res.json(parlays);
        return;
	});

	router.post("/new", validateSchema(Joi.object()), async (req, res) => {});

	return router;
};
