import express from "express";
import Paystack from "../services/paystack";
import { validateSchema } from "../middleware/validate";
import Joi from "joi";
import { AxiosError } from "axios";
import { WalletService } from "../services/wallet.service";

const router = express.Router();

export default () => {
	router.get("/", (req, res) => {
		res.send("Hello World");
	});

	router.post(
		"/fund",
		validateSchema(
			Joi.object({
				email: Joi.string().email(),
				amount: Joi.number().precision(2).max(100000),
			})
		),
		async (req, res) => {
			try {
				const paystackTxn = await Paystack.initalizeTransaction(
					req.body.amount,
					req.user!.email
				);

				const tx = await new WalletService().initializeTransaction({
					amount: req.body.amount,
					name: "Wallet fund",
					reference: paystackTxn.data.data.reference,
					wallet_id: req.user!.wallet.id,
					user_id: req.user!.id,
				});

				res.json({ transaction: paystackTxn.data.data, data: tx });
			} catch (error: any) {
				console.error(error);
				res.status(500).json({ message: error.message });
			}

			return;
		}
	);

	router.post(
		"/verify/:reference",
		validateSchema(
			Joi.object({
				reference: Joi.string().required(),
			}),
			true
		),
		async (req, res) => {
			try {
				console.log(req.body);
				const walletService = new WalletService();
				const { reference } = req.params;

				const v = await Paystack.verifyTransaction(reference);

				const paystackTx = v.data.data;

				const transaction = await walletService.getTransaction({
					id: req.body.transaction_id,
				});

				if (!transaction) {
					res.status(400).json({ message: "Bad request" });
					return;
				}

				if (paystackTx.status != "success") {
					res.status(400).json({ message: "Transaction failed." });
					return;``
				}

				if (paystackTx.amount / 100 != transaction.amount) {
					// ! paystack works /100
					res.status(400).json({ message: "Amount mismatch" });
					return;
				}

				transaction.processing_id = String(paystackTx.id);

				res.json(await walletService.fundWallet(transaction));
			} catch (error: any) {
				console.error(error);
				res.status(500).json({ message: error.message || "error" });
			}
		}
	);

	return router;
};
