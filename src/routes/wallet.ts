import express from "express";
import Paystack from "../services/paystack";
import { validateSchema } from "../middleware/validate";
import Joi from "joi";
import { AxiosError } from "axios";

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
				const tx = await Paystack.initalizeTransaction(
					req.body.amount,
					req.user!.email
				);

				res.json({ transaction: tx.data.data });
			} catch (error: any) {
				console.error(error);
				res.status(500).json({ message: error.message });
			}

			return;
		}
	);

	return router;
};
