import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Timestamp from "./Timestamp";
import { Status } from "./Parlay";

@Entity({
	name: "transactions",
})
export class Transaction extends Timestamp {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_id: number;

	@Column()
	wallet_id: number;

	@Column()
	reference: string;

	@Column()
	processing_id: string;

	@Column()
	amount: number;

	@Column()
	status: Status;

	@Column()
	name: string;

	@Column()
	description: string;
}
