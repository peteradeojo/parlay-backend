import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DefaultColumns, DefaultColumnsWithId } from "../data-source";
import { Status } from "../entity/Parlay";

export class CreateBetsTable1735284030425 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "bets",
				columns: [
					...DefaultColumnsWithId,
					{
						name: "player_id",
						type: "bigint",
					},
					{
						name: "status",
						type: "smallint",
						default: Status.OPEN,
					},
					{
						name: "selected_outcome",
						type: "smallint",
					},
					{
						name: "odds",
						type: "numeric",
					},
				],
				foreignKeys: [
					{
						columnNames: ["player_id"],
						referencedColumnNames: ["id"],
						referencedTableName: "users",
					},
				],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("bets");
	}
}
