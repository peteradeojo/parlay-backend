import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import Timestamp from "./Timestamp";
import { User } from "./User";

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
	id: Number;

	@Column()
	title: String;

	@JoinColumn({
		name: "creator_id",
	})
	@OneToOne(() => User)
	creator_id: Number;

	@Column({
		type: "json",
	})
	outcomes: ParlayOutcome[];

	@Column()
	pool: Number;

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
}
