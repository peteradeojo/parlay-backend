import {
	DataSource,
	DeepPartial,
	FindOptionsSelect,
	Repository,
} from "typeorm";
import Database from "../lib/database";
import { User } from "../entity/User";

import { hashSync, genSaltSync } from "bcrypt";
import { WalletService } from "../services/wallet.service";

export default class UserController {
	private userRepository: Repository<User>;

	public constructor() {
		this.userRepository = Database.datasource.getRepository(User);
	}

	async registerUser(data: DeepPartial<User>) {
		let user = this.userRepository.create(data);

		const salt = genSaltSync(12);
		user.password = hashSync(data.password!, salt);

		user = await this.userRepository.save(user);
		const wallet = new WalletService().createWallet(user.id);

		return user;
	}

	async getUser(email: string, selected: (keyof User)[] = []) {
		return await this.userRepository.findOne({
			where: { email },
			select: [
				"email",
				"id",
				"firstname",
				"lastname",
				"createdat",
				...selected,
			],
			relations: {
				wallet: true,
			},
		});
	}
}
