import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import bcrypt from "bcrypt";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column()
  mobileNumber: string;

  @Column({ default: false })
  isVarified: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: true })
  lastActive: string;

  @Column({ default: 1 })
  version: number;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @BeforeUpdate()
  async updateVersion() {
    this.version++; // Increment version on update
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      // Only hash if the password field has a value
      const salt = await bcrypt.genSalt(10); // Generate a salt with desired cost (10 is common)
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
