import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Timestamp from "./Timestamp";
import { Status } from "./Parlay";

@Entity()
export class Transaction extends Timestamp {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_id: number;

	@Column()
	wallet_id: number;

	@Column()
	amount: number;

	@Column()
	status: Status;

	@Column()
	name: string | null;

	@Column()
	description: string | null;
}
