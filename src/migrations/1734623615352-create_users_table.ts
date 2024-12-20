import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { DefaultColumns } from "../data-source";

export class CreateUsersTable1734623615352 implements MigrationInterface {
    name = 'CreateUsersTable1734623615352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "age" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                new TableColumn({
                    name: 'id',
                    isPrimary: true,
                    type: 'bigserial',
                }),
                new TableColumn({
                    name: 'firstname',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'lastname',
                    type: 'varchar'
                }),
                {
                    name: 'email',
                    isUnique: true,
                    type: 'varchar'
                },
                {
                    name: 'password',
                    type: 'varchar',
                    isNullable: true,
                },
                ...DefaultColumns,
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
