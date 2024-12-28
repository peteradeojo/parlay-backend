import "reflect-metadata";
import {
	DataSource,
	TableColumnOptions,
} from "typeorm";
import { User } from "./entity/User";
import { Parlay } from "./entity/Parlay";
import { Wallet } from "./entity/Wallet";
import Bet from "./entity/Bet";
import { Transaction } from "./entity/Transaction";

if (process.env.APP_ENV != "production") {
	require("dotenv").config();
}

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
	entities: [User, Parlay, Wallet, Transaction, Bet],
	migrations: [
		process.env.NODE_ENV == "production"
			? "./build/migrations/*.js"
			: "./src/migrations/*.ts",
	],
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

export const DefaultColumnsWithId = [
	...DefaultColumns,
	{
		name: "id",
		type: "bigserial",
		isPrimary: true,
	},
];
