import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString } from 'class-validator';
const data = require('./data')

@Entity()
export default class Game extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?:number;

    @IsString()
    @Column("text", {nullable:false})
    name:string;

    @Column("text", {nullable:false})
    color:string;

    @Column("json", {
        array: true,
        default: data.defaultBoard,
        nullable: false
    })
    board:string[][];
}