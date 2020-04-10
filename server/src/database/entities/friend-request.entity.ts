import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('friend-requests')
export class FriendRequest {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('uuid', { name: "user_a_id" })
    userA: string;

    @Column('uuid', { name: "user_b_id" })
    userB: string;

    @Column('boolean', { default: false })
    status: boolean
}