import { DeepPartial, Repository } from "typeorm";
import Bet from "../entity/Bet";
import Database from "../lib/database";
import { Parlay, Status } from "../entity/Parlay";
import { Transaction } from "../entity/Transaction";
import ParlayController from "../controllers/parlays.controller";

export default class BettingService {
	static repository: Repository<Bet>;

	static async placeBet(
		parlay: Parlay,
		transaction: Transaction,
		data: Pick<Bet, "odds" | "selected_outcome">
	) {
		const bet = this.repository.create({
			amount: Math.abs(transaction.amount),
			player_id: transaction.user_id,
			parlay_id: parlay.id,
			status: Status.OPEN,
			odds: data.odds,
			selected_outcome: data.selected_outcome,
		});

		parlay.pool += parlay.entry_amount;
		new ParlayController().saveParlay(parlay);

		return await this.repository.save(bet);
	}

	static async userHasPlacedBet(userId: number, parlayId: number) {
		return await this.repository.exists({
			where: {
				player_id: userId,
				parlay_id: parlayId,
				status: Status.OPEN,
			},
		});
	}

	static bootstrap() {
		this.repository = Database.datasource.getRepository(Bet);
	}

	static async getParlayBets(parlay_id: number) {
		return await this.repository.find({
			where: { parlay_id, status: Status.OPEN },
		});
	}

	static async getOutcomeBetTotal(parlay_id: number, outcome: number) {
		return await this.repository.sum("amount", {
			parlay_id,
			selected_outcome: outcome,
			status: Status.OPEN,
		});
	}
}
