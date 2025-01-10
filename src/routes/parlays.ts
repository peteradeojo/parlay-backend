import express from "express";
import ParlayController from "../controllers/parlays.controller";
import { validateSchema } from "../middleware/validate";
import Joi from "joi";
import { Parlay, Status } from "../entity/Parlay";
import { DeepPartial } from "typeorm";
import { randomInt } from "crypto";
import { WalletService } from "../services/wallet.service";
import BettingService from "../services/bets.service";
import { HttpStatusCode } from "axios";

const router = express.Router();

export default () => {
	const parlaySchema = Joi.object({
		title: Joi.string().required(),
		outcomes: Joi.array<string>().max(4).items(Joi.string()).optional(),
		status: Joi.number().allow(Status),
		entry_amount: Joi.number().optional().min(100),
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

	router.post(
		"/new",
		validateSchema(
			parlaySchema.append({
				selected_outcome: Joi.number().max(4).required(),
			})
		),
		async (req, res) => {
			try {
				const data: DeepPartial<Parlay & { selected_outcome: number }> =
					req.body;
				const is_draft = req.body.status === 0;
				if (!is_draft && !data.entry_amount) {
					res
						.status(400)
						.json({ message: "Can't publish a parlay with empty amount." });
					return;
				}

				if (
					req.user!.wallet.amount == 0 ||
					req.user!.wallet.amount < data.entry_amount!
				) {
					res.status(419).json({ message: "Fund your wallet" });
					return;
				}

				let parlay = new ParlayController().initializeParlay(
					{ ...data, creator_id: req.user!.id },
					is_draft
				);

				if (!is_draft) {
					// * this is a published parlay
					const transaction = await new WalletService().initializeTransaction({
						user_id: req.user!.id,
						wallet_id: req.user!.wallet.id,
						amount: -1 * Number(data.entry_amount),
						name: "Parlay entry",
						reference: "PAR-" + parlay.code,
						// processing_id: String(parlay.id),
						status: Status.OPEN,
						description: parlay.title,
					});

					await new WalletService().fundWallet(transaction);
					parlay = await new ParlayController().saveParlay(parlay); // * need to save to get the parlay id

					await BettingService.placeBet(parlay, transaction, {
						selected_outcome: data.selected_outcome || 0,
						odds: 1.0,
					});

					transaction.processing_id = String(parlay.id);
					await new WalletService().saveTransaction(transaction);
				} else {
					parlay = await new ParlayController().saveParlay(parlay);
				}

				res.json(parlay);
			} catch (err: any) {
				console.error(err);
				console.error(err.stack);
				res.status(500).json({ error: err });
			}
			return;
		}
	);

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
			if (!parlay) {
				res.status(404).json({ message: "Not found" });
				return;
			}

			const odds = await Promise.all(
				parlay!.outcomes.map(async (o, k) => {
					let noBets = false;
					let amt = await BettingService.getOutcomeBetTotal(parlay?.id, k);

					if (!amt || amt < 1) {
						noBets = true;
						amt = 1;
					}

					const odds = parlay.pool / amt;
					return { value: odds, noBets };
				})
			);
			res.json({ parlay, odds });
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

					await BettingService.placeBet(parlay, tx, {
						selected_outcome: 0,
						odds: 1,
					});

					await walletService.fundWallet(tx);
				}

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

				res.json({ parlay });
			} catch (error: any) {
				console.error(error);
				res.status(500).json({ message: error.message });
			}
			return;
		});

	router.post(
		"/enter/:id(\\d+)",
		validateSchema(
			Joi.object({
				selected_outcome: Joi.number().required().max(4),
				odds: Joi.number().optional(),
				id: Joi.number().optional(),
			})
		),
		async (req, res) => {
			const id = Number(req.params.id);

			const parlay = await new ParlayController().getParlay(id);

			if (!parlay) {
				res
					.status(HttpStatusCode.NotFound)
					.json({ message: "Parlay not found" });
				return;
			}

			if (await BettingService.userHasPlacedBet(req.user!.id, parlay.id)) {
				res
					.status(HttpStatusCode.ExpectationFailed)
					.json({ message: "User has placed a bet already." });
				return;
			}

			if (parlay.entry_amount > req.user!.wallet.amount) {
				res.status(HttpStatusCode.ExpectationFailed).json({
					message: "Please fund your wallet",
				});
				return;
			}

			const transaction = await new WalletService().initializeTransaction({
				amount: -1 * parlay.entry_amount,
				name: "Parlay entry",
				reference: `PAR-${parlay.code}-${req.user!.id}`,
				status: Status.OPEN,
				user_id: req.user!.id,
				wallet_id: req.user!.wallet.id,
			});

			await new WalletService().fundWallet(transaction);
			const bet = await BettingService.placeBet(parlay, transaction, {
				...req.body,
			});

			res.json({ bet });
			return;
		}
	);

	return router;
};
