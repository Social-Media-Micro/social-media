import { Column, Entity, ManyToOne } from "typeorm";
import { CustomBaseEntity } from "./baseEntity";
import { UserEntity } from "./userEntity";

@Entity()
export class UserSessionEntity extends CustomBaseEntity {
  @Column()
  ip: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column()
  userAgent: string;

  @ManyToOne(() => UserEntity, (user) => user.userSession)
  user: UserEntity;
}
