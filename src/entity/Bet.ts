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
import { Parlay, Status } from "./Parlay";

@Entity({
	name: "bets",
})
export default class Bet extends Timestamp {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	parlay_id: number;

	@Column()
	amount: number;

	@Column()
	player_id: number;

	@Column()
	status: Status;

	@Column()
	selected_outcome: number;

	@Column()
	odds: number;

	@JoinColumn({
		name: "parlay_id",
		referencedColumnName: "id",
	})
	@ManyToOne(() => Parlay, (parlay) => parlay.bets)
	parlay: Parlay;
}
