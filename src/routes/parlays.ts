import express from "express";
import ParlayController from "../controllers/parlays.controller";
import { validateSchema } from "../middleware/validate";
import Joi from "joi";
import { Status } from "../entity/Parlay";

const router = express.Router();

export default () => {
	const parlaySchema = Joi.object({
		title: Joi.string().required(),
		outcomes: Joi.array<string>().max(4).items(Joi.string()).optional(),
		status: Joi.number().allow(Status),
		entry_amount: Joi.number().optional(),
		start_date: Joi.string()
			.regex(/\d{4}-\d{2}-\d{2}/)
			.optional(),
		close_date: Joi.string()
			.regex(/\d{4}-\d{2}-\d{2}/)
			.optional(),
		start_time: Joi.string()
			.regex(/\d{2}:\d{2}/)
			.optional(),
		close_time: Joi.string()
			.regex(/\d{2}:\d{2}/)
			.optional(),
	});

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

	router.post("/new", validateSchema(parlaySchema), async (req, res) => {
		try {
			const parlay = await new ParlayController().createParlay(
				{ ...req.body, creator_id: req.user!.id },
				req.body.status === 0
			);

			res.status(201).json({ parlay, is_draft: parlay.status == Status.DRAFT });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: err });
		}
		return;
	});

	router.get("/drafts", async (req, res) => {
		const drafts = await new ParlayController().getUserDrafts(req.user.id);
		res.json(drafts);
		return;
	});

	router
		.route("/:id(\\d+)")
		.get(async (req, res) => {
			const parlay = await new ParlayController().getParlay(
				Number(req.params.id)
			);
			res.json(parlay);
		})
		.post(validateSchema(parlaySchema), async (req, res) => {});

	return router;
};
