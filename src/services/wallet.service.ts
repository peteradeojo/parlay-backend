import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { Wallet } from "../entity/Wallet";
import Database from "../lib/database";
import { Transaction } from "../entity/Transaction";
import { Status } from "../entity/Parlay";

export class WalletService {
	private repository: Repository<Wallet>;
	private transactions: Repository<Transaction>;

	constructor() {
		this.repository = Database.datasource.getRepository(Wallet);
		this.transactions = Database.datasource.getRepository(Transaction);
	}

	async createWallet(userId: number): Promise<Wallet> {
		const wallet = this.repository.create({
			user_id: userId,
		});

		return await this.repository.save(wallet);
	}

	async fundWallet(transaction: Transaction): Promise<Transaction> {
		if (transaction.status != Status.OPEN) {
			throw new Error("Cannot fund from an already completed transaction.");
		}

		transaction.status = Status.RESOLVED;
		await this.transactions.save(transaction);

		await this.repository.increment(
			{
				id: transaction.wallet_id,
			},
			"amount",
			transaction.amount
		);

		return transaction;
	}

	async initializeTransaction(data: DeepPartial<Transaction>) {
		const transaction = this.transactions.create(data);
		return await this.transactions.save(transaction);
	}

	async getTransaction(query: FindOptionsWhere<Transaction>) {
		return this.transactions.findOne({ where: query });
	}
}
