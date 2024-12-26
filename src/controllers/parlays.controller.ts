import { DeepPartial, In, Not, Repository, UpdateResult } from "typeorm";
import Database from "../lib/database";
import { Parlay, Status } from "../entity/Parlay";
import { randomInt } from "crypto";
import { User } from "../entity/User";
import Bet from "../entity/Bet";

export default class ParlayController {
	private repository: Repository<Parlay>;

	static readonly MIN_CODE = 9999;
	static readonly MAX_CODE = 1000000;

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
			where: {
				status: In([Status.OPEN, Status.RUNNING]),
			},
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

	async getParlay(id: number | string): Promise<Parlay|null> {
		return await this.repository.findOne({
			where: { id: Number(id) },
			relations: {
				creator: true,
			},
		});
	}

	async updateParlay(
		id: Number,
		data: DeepPartial<Parlay>
	): Promise<UpdateResult> {
		const parlay = await this.repository.update(
			{
				id,
			},
			data
		);
		return parlay;
	}

	async enterParlay(user_id: number, parlay_id: number): Promise<Bet|null> {
		return null;
	}
}
