import { DeepPartial, In, Not, Repository } from "typeorm";
import Database from "../lib/database";
import { Parlay, Status } from "../entity/Parlay";
import { randomInt } from "crypto";

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
		} else {
			parlay.code = randomInt(9999, 1000000);
		}

		await this.repository.save(parlay);

		return parlay;
	}

	async getUserParlays(userId: number): Promise<Parlay[]> {
		return await this.repository.find({
			where: {
				creator_id: userId,
				status: Not(In([Status.DRAFT])),
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

	async getUserDrafts(userid: number): Promise<Parlay[]> {
		return await this.repository.find({
			where: {
				creator_id: userid,
				status: Status.DRAFT,
			},
		});
	}

	async getParlay(id: number | string): Promise<Parlay> {
		return await this.repository.findOne({ where: { id: Number(id) } });
	}
}
