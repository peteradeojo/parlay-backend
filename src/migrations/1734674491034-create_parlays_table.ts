import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from "typeorm";
import { Status } from "../entity/Parlay";
import { DefaultColumns } from "../data-source";

export class CreateParlaysTable1734674491034 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "parlays",
				columns: [
					{
						name: "id",
						isPrimary: true,
						type: "bigserial",
					},
					{
						name: "title",
						type: "varchar",
					},
					{
						name: "code",
						type: "integer",
						isNullable: true,
					},
					{
						name: "outcomes",
						type: "json",
						isNullable: true,
						isArray: true,
					},
					{
						name: "creator_id",
						type: "bigint",
					},
					{
						name: "status",
						type: "smallint",
						default: Status.DRAFT,
					},
					{
						name: "pool",
						type: "numeric",
						precision: 2,
						default: 0,
					},
					{
						name: "entry_amount",
						type: "numeric",
						precision: 2,
						isNullable: true,
					},
					{
						name: "start_date",
						type: "timestamp",
						isNullable: true,
					},
					{
						name: "close_date",
						type: "timestamp",
						isNullable: true,
					},
					...DefaultColumns,
				],
				foreignKeys: [
					new TableForeignKey({
						name: "creator",
						referencedTableName: "users",
						referencedColumnNames: ["id"],
						columnNames: ["creator_id"],
					}),
				],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("parlays");
	}
}
