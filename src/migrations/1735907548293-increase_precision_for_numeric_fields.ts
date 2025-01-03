import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class IncreasePrecisionForNumericFields1735907548293
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn(
			"parlays",
			"entry_amount",
			new TableColumn({
				name: "entry_amount",
				type: "numeric",
				precision: undefined,
				scale: undefined,
				default: 0,
			})
		);
		await queryRunner.changeColumn(
			"parlays",
			"pool",
			new TableColumn({
				name: "pool",
				type: "numeric",
				precision: undefined,
				scale: undefined,
				default: 0,
			})
		);
		await queryRunner.changeColumn(
			"wallets",
			"amount",
			new TableColumn({
				name: "amount",
				type: "numeric",
				precision: undefined,
				scale: undefined,
				default: 0,
			})
		);
		await queryRunner.changeColumn(
			"bets",
			"amount",
			new TableColumn({
				name: "amount",
				type: "numeric",
				precision: undefined,
				scale: undefined,
				default: 0,
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn(
			"parlays",
			"entry_amount",
			new TableColumn({
				name: "entry_amount",
				type: "numeric",
				precision: 6,
				scale: 2,
				default: 0,
			})
		);
		await queryRunner.changeColumn(
			"parlays",
			"pool",
			new TableColumn({
				name: "pool",
				type: "numeric",
				precision: 6,
				scale: 2,
				default: 0,
			})
		);
		await queryRunner.changeColumn(
			"wallets",
			"amount",
			new TableColumn({
				name: "amount",
				type: "numeric",
				precision: 6,
				scale: 2,
				default: 0,
			})
		);
		await queryRunner.changeColumn(
			"bets",
			"amount",
			new TableColumn({
				name: "amount",
				type: "numeric",
				precision: 6,
				scale: 2,
				default: 0,
			})
		);
	}
}
