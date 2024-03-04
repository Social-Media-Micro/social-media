import { type MigrationInterface, type QueryRunner } from "typeorm";

export class User1709495964142 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {}

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
