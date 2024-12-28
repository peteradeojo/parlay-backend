import {
	MigrationInterface,
	QueryRunner,
	TableColumn,
	TableForeignKey,
} from "typeorm";

export class AddParlayIdToBets1735414851796 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumns("bets", [
			new TableColumn({
				name: "parlay_id",
				type: "bigint",
			}),
			new TableColumn({
				name: "amount",
				type: "numeric",
				scale: 2,
				default: 0,
			}),
		]);

		await queryRunner.createForeignKey(
			"bets",
			new TableForeignKey({
				columnNames: ["parlay_id"],
				referencedTableName: "parlays",
				referencedColumnNames: ["id"],
				name: "bets_parlays",
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey("bets", "bets_parlays");
		await queryRunner.dropColumns("bets", ["parlay_id", "amount"]);
	}
}
