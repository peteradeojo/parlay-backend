import express from "express";
import Joi from "joi";
import { validateSchema } from "../middleware/validate";
import UserController from "../controllers/user.controller";
import { generateToken } from "../lib/util";
import { compareSync } from "bcrypt";
import passport from "passport";
import { WalletService } from "../services/wallet.service";

const router = express.Router();

export default () => {
	router.post(
		"/register",
		validateSchema(
			Joi.object({
				firstname: Joi.string(),
				lastname: Joi.string(),
				email: Joi.string().email().required(),
				password: Joi.string(),
				terms: Joi.bool().valid(true),
			})
		),
		async (req, res) => {
			const controller = new UserController();

			console.log(req.body);

			try {
				const userData = req.body;
				const result = await controller.registerUser(userData);

				const token = generateToken({
					id: result.id,
					email: result.email,
				});

				res.json({
					token,
					user: { ...result, password: undefined, id: undefined },
				});
				return;
			} catch (error) {
				console.error(error);
				res.status(500).json({ error });
				return;
			}
		}
	);

	router.post(
		"/login",
		validateSchema(
			Joi.object({
				email: Joi.string().email(),
				password: Joi.string(),
			})
		),
		async (req, res) => {
			const { email } = req.body;

			const user = await new UserController().getUser(email, ["password"]);

			if (!user) {
				res.status(400).json({
					message: "User not found",
				});
				return;
			}

			const correct = compareSync(req.body.password, user.password);

			if (!correct) {
				res.status(403).json({
					message: "Invalid password.",
				});
				return;
			}

			if (user.wallet == null) {
				const wallet = await new WalletService().createWallet(user.id);
				user.wallet = wallet;
			}

			const token = generateToken({
				id: user.id,
				email: user.email,
			});

			res.json({
				token,
				user: { ...user, id: undefined, password: undefined },
			});
			return;
		}
	);

	router.get(
		"/",
		passport.authenticate("jwt", { session: false }),
		async (req, res) => {
			res.json(req.user);
		}
	);

	return router;
};
