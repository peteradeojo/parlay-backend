import { DeepPartial, Repository } from "typeorm";
import Database from "../lib/database";
import { Parlay, Status } from "../entity/Parlay";

export default class ParlayController {
	private repository: Repository<Parlay>;

	constructor() {
		this.repository = Database.datasource.getRepository(Parlay);
	}

	async createParlay(
		data: DeepPartial<Parlay>,
		as_draft = false
	): Promise<Parlay> {
		const parlay = this.repository.create(data);

		if (as_draft) {
			parlay.status = Status.DRAFT;
		}

		return parlay;
	}

	async getUserParlays(userId: number): Promise<Parlay[]> {
		return await this.repository.find({
			where: {
				creator_id: userId,
			},
		});
	}

	async getTopParlays(): Promise<Parlay[]> {
		return await this.repository.find({
			take: 8,
			order: {
				createdat: "desc",
			},
		});
	}
}
