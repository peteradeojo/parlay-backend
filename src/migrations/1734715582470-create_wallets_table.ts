import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DefaultColumns } from "../data-source";
import { Status } from "../entity/Parlay";

export class CreateWalletsTable1734715582470 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "wallets",
				columns: [
					{
						name: "id",
						type: "bigserial",
						isPrimary: true,
					},
					{
						name: "amount",
						type: "numeric",
						precision: 2,
						default: 0,
					},
					{
						name: "user_id",
						type: "bigint",
						isUnique: true,
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
						referencedTableName: "users",
						referencedColumnNames: ["id"],
                        name: 'wallet_owner',
					},
				],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("wallets");
	}
}
