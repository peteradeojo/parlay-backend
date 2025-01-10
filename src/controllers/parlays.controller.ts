import { DeepPartial, In, Not, Repository, UpdateResult } from "typeorm";
import Database from "../lib/database";
import { Parlay, Status } from "../entity/Parlay";
import { randomInt } from "crypto";
import { User } from "../entity/User";
import Bet from "../entity/Bet";
import BettingService from "../services/bets.service";

export default class ParlayController {
	private repository: Repository<Parlay>;
	private betsRepository: Repository<Bet>;

	static readonly MIN_CODE = 9999;
	static readonly MAX_CODE = 1000000;

	constructor() {
		this.repository = Database.datasource.getRepository(Parlay);
		this.betsRepository = Database.datasource.getRepository(Bet);
	}

	initializeParlay(data: DeepPartial<Parlay>, as_draft = false) {
		if (as_draft) {
			data.status = Status.DRAFT;
		} else {
			data.code = randomInt(9999, 1000000);
		}

		return this.repository.create({
			...data,
			status: as_draft ? Status.DRAFT : Status.OPEN,
		});
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

	async getParlay(id: number | string) {
		const parlay = await this.repository.findOne({
			where: { id: Number(id) },
			relations: {
				creator: true,
				bets: true,
			},
		});

		return parlay;
	}

	async saveParlay(parlay: Parlay) {
		return await this.repository.save(parlay, { reload: true });
	}

	async updateParlay(
		id: number,
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

	async enterParlay(user_id: number, parlay_id: number): Promise<Bet | null> {
		return null;
	}

	async getOutcomeOdds(parlay_id: number, outcome: number) {
		const pool = await BettingService.getParlayBets(parlay_id);
	}
}
