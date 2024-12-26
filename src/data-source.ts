import "reflect-metadata";
import { DataSource, TableColumn, TableColumnOptions } from "typeorm";
import { User } from "./entity/User";
import { Parlay } from "./entity/Parlay";
import { Wallet } from "./entity/Wallet";

export const AppDataSource = new DataSource({
	type: "postgres",
	// host: process.env.DB_HOST,
	// port: Number(process.env.DB_PORT),
	// username: process.env.DB_USER,
	// password: process.env.DB_PASSWORD,
	// database: process.env.DB_NAME,
	url: process.env.DATABASE_URL,
	synchronize: false,
	logging: false,
	entities: [User, Parlay, Wallet],
	migrations: ["./src/migrations/*.ts"],
	subscribers: [],
});

export const DefaultColumns: TableColumnOptions[] = [
	{
		name: "createdAt",
		type: "timestamp",
		default: "current_timestamp",
		precision: 0,
	},
	{
		name: "updatedat",
		type: "timestamp",
		default: "current_timestamp",
		precision: 0,
	},
];
