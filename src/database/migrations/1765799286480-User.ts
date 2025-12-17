import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class User1765799286480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "user_id",
            type: "text",
            isPrimary: true,
          },
          {
            name: "name",
            type: "text",
            isNullable: false,
          },
          {
            name: "email",
            type: "text",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "password",
            type: "text",
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
