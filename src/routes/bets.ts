import { Router } from "express";
import BettingService from "../services/bets.service";

const router = Router();

export default () => {
	router.get("/", async (req, res) => {
		const data = await BettingService.getUserBets(req.user!.id);
		res.json(data);
		return;
	});

	router.get("/:id", async (req, res) => {
		try {
			const play = await BettingService.getUserPlay(
				Number(req.params.id),
				req.user!.id
			);

			if (!play) {
				res.status(404).json({ message: "Bet not found" });
				return;
			}

			res.json(play);
			return;
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: (error as any).message });
			return;
		}
	});

	return router;
};
