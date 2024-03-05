import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import bcrypt from "bcrypt";
import { CustomBaseEntity } from "./baseEntity";
import { UserSessionEntity } from "./userSessionEntity";

@Entity()
export class UserEntity extends CustomBaseEntity {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ default: false })
  isVerifiedEmail: boolean;

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

  @OneToMany(() => UserSessionEntity, (userSession) => userSession.user)
  userSession: UserSessionEntity[];

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
