import { Column, Entity } from "typeorm";

@Entity()
export default class Timestamp {
    @Column({
        type: 'timestamp',
        precision: 0,
        name: 'createdAt',
    })
    createdat: Date;
    
    @Column({
        name: 'updatedat',
        type: 'timestamp',
        precision: 0
    })
    updatedat: Date;
}