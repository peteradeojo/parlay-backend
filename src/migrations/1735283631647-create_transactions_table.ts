import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { Status } from "../entity/Parlay";
import { DefaultColumns } from "../data-source";

export class CreateTransactionsTable1735283631647
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "transactions",
				columns: [
					{
						name: "id",
						type: "bigserial",
						isPrimary: true,
					},
					{
						name: "name",
						type: "varchar",
						length: "64",
						isNullable: true,
					},
					{
						name: "description",
						type: "text",
						isNullable: true,
					},
					{
						name: "amount",
						type: "numeric",
						scale: 2,
						default: 0,
					},
					{
						name: "reference",
						type: "varchar",
					},
					{
						name: "processing_id",
						type: "varchar",
						isNullable: true,
					},
					{
						name: "user_id",
						type: "bigint",
						isNullable: false,
					},
					{
						name: "wallet_id",
						type: "bigint",
						isNullable: false,
					},
					{
						name: "status",
						type: "smallint",
						default: Status.OPEN,
					},
					...DefaultColumns,
				],
				foreignKeys: [
					{
						columnNames: ["user_id"],
						referencedColumnNames: ["id"],
						referencedTableName: "users",
					},
					{
						columnNames: ["wallet_id"],
						referencedColumnNames: ["id"],
						referencedTableName: "wallets",
					},
				],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("transactions");
	}
}
