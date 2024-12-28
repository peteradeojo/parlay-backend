import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import Timestamp from "./Timestamp";
import { User } from "./User";
import Bet from "./Bet";

export enum Status {
	DRAFT = 0,
	OPEN = 1,
	RUNNING = 2,
	CLOSED = 3,
	RESOLVED = 4,
}

export type ParlayOutcome = {
	name: string;
	status: Status;
}[];

@Entity({
	name: "parlays",
})
export class Parlay extends Timestamp {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	creator_id: Number;

	@Column({
		type: "json",
	})
	outcomes: ParlayOutcome[];

	@Column()
	pool: number;

	@Column()
	status: Status;

	@Column()
	code: number;

	@Column()
	entry_amount: number;

	@Column()
	start_date: string;

	@Column()
	close_date: string;

	@Column()
	start_time: string;

	@Column()
	close_time: string;

	@JoinColumn({
		name: "creator_id",
		referencedColumnName: "id",
	})
	@OneToOne(() => User)
	creator: User;

	@JoinColumn({
		name: "id",
		referencedColumnName: "parlay_id",
	})
	@OneToMany(() => Bet, (bet) => bet.parlay)
	bets: Bet[];
}
