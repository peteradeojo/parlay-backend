import express from "express";
import ParlayController from "../controllers/parlays.controller";
import { validateSchema } from "../middleware/validate";
import Joi from "joi";
import { Parlay, Status } from "../entity/Parlay";
import { DeepPartial } from "typeorm";
import { randomInt } from "crypto";
import { WalletService } from "../services/wallet.service";

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
			const data: DeepPartial<Parlay> = req.body;

			const parlay = await new ParlayController().createParlay(
				{ ...req.body, creator_id: req.user!.id },
				req.body.status === 0
			);

			res.json(parlay);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: err });
		}
		return;
	});

	router.get("/drafts", async (req, res) => {
		const drafts = await new ParlayController().getUserDrafts(req.user!.id);
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
		.patch(validateSchema(parlaySchema, true), async (req, res) => {
			try {
				const {
					outcomes,
					title,
					close_date,
					close_time,
					entry_amount,
					start_date,
					start_time,
					status,
				}: Partial<Parlay> = req.body;
				const controller = new ParlayController();

				const parlay = await controller.getParlay(req.body.id);
				if (!parlay) {
					res.status(400).json({
						message: "Parlay not found",
					});
					return;
				}

				if (parlay.status != Status.DRAFT) {
					res.status(400).json({
						message:
							"This parlay has reached a resolved state already and cannot be re-opened",
					});
					return;
				}

				if (req.user!.wallet.amount < parlay.entry_amount) {
					res.status(419).json({ message: "Insufficient funds." });
					return;
				}

				let code: number | undefined = undefined;

				if (status == Status.OPEN) {
					code = randomInt(
						ParlayController.MIN_CODE,
						ParlayController.MAX_CODE
					);
				}

				const walletService = new WalletService();

				const tx = await walletService.initializeTransaction({
					amount: -1 * parlay.entry_amount,
					name: "Parlay entry",
					description: parlay.title,
					reference: "PAR-" + String(code),
					status: Status.OPEN,
					user_id: req.user!.id,
					wallet_id: req.user!.wallet.id,
				});

				await walletService.fundWallet(tx);

				await controller.updateParlay(parlay.id, {
					title,
					outcomes,
					close_date,
					close_time,
					start_date,
					start_time,
					status,
					entry_amount,
					code,
				});

				res.json({ parlay, transaction: tx });
			} catch (error: any) {
				console.error(error);
				res.status(500).json({ message: error.message });
			}
		});

	router.post("/enter/:id(\\d+)", async (req, res) => {});

	return router;
};
