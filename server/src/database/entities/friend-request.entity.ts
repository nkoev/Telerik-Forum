import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('friend-requests')
export class FriendRequest {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('uuid')
    user_a_id: string;

    @Column('uuid')
    user_b_id: string;

    @Column('boolean', { default: false })
    status: boolean
}