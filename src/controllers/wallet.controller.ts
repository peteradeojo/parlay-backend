import { Repository, UpdateResult } from "typeorm";
import { Wallet } from "../entity/Wallet";
import Database from "../lib/database";

export default class WalletController {
	private repository: Repository<Wallet>;

	constructor() {
		this.repository = Database.datasource.getRepository(Wallet);
	}

	async updateWalletBalance(
		wallet_id: number,
		amount: number
	): Promise<UpdateResult> {
		if (amount > 0) {
			return await this.repository.increment(
				{
					id: wallet_id,
				},
				"amount",
				amount
			);
		} else {
			return await this.repository.decrement(
				{
					id: wallet_id,
				},
				"amount",
				Math.abs(amount)
			);
		}
	}
}
