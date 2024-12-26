import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Timestamp from "./Timestamp";
import { Status } from "./Parlay";

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
	outcome: number;

    @Column()
    odds: number;
}
