import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Timestamp from "./Timestamp";
import { Status } from "./Parlay";
import { User } from "./User";

@Entity({
	name: "wallets",
})
export class Wallet extends Timestamp {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	amount: number;

	@Column()
	user_id: number;

	@Column()
	status: Status;

	@JoinColumn({
		name: 'user_id',
	})
	@OneToOne(() => User, (user) => user.wallet)
	user: User;
}
