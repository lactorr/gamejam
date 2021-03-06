/*
  Level class
*/
import { LevelEntity } from "./levelEntity";
import * as Phaser from 'phaser';

export type Level = {
  elements?: Array<LevelEntity>;
  blockGroup?: Phaser.GameObjects.Group;
  checkpointGroup?: Phaser.GameObjects.Group;
  checkpointValidatedGroup?: Phaser.GameObjects.Group;
  collisionGroup?: Phaser.GameObjects.Group;
  switchAliveGroup?: Phaser.GameObjects.Group;
  switchDeadGroup?: Phaser.GameObjects.Group;
  checkpoints?:number[];
  levelWidth?:number;
}
