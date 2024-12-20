import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	OneToOne,
	JoinColumn,
} from "typeorm";
import Timestamp from "./Timestamp";
import { Parlay } from "./Parlay";
import { Wallet } from "./Wallet";

@Entity({
	name: "users",
})
export class User extends Timestamp {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstname: string;

	@Column()
	lastname: string;

	@Column()
	email: string;

	@Column({
		select: false,
	})
	password: string;

	@OneToMany(() => Parlay, (parlay) => parlay.creator_id)
	parlays: Parlay[];

	@OneToOne(() => Wallet, (wallet) => wallet.user)
	wallet: Wallet;
}
