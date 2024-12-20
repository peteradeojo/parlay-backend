import { Repository } from "typeorm";
import { Wallet } from "../entity/Wallet";
import Database from "../lib/database";

export class WalletService {
	private repository: Repository<Wallet>;

	constructor() {
		this.repository = Database.datasource.getRepository(Wallet);
	}

    async createWallet(userId: number): Promise<Wallet> {
        const wallet = this.repository.create({
            user_id: userId
        });

        return await this.repository.save(wallet);
    }
}
