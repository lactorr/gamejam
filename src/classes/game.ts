/*
  Game stuff
*/
import * as Phaser from 'phaser';
import { InputData } from "./inputManager";
import { Player } from "./player";
import { Level } from "./level";
import { RenderEngine } from "./renderEngine";
import { GameScene } from "./gameScene";

// TODO: Remove soon
/** Todo: test */
/* TODO: test */

var player;
var player2;
var ground;
var cursors;
var platform;

export class Game {

  private inputData: InputData = { deltaX: 0, deltaY: 0 };
  private gameRunning = true;
  private renderEngine: RenderEngine;
  private level: Level;
  private playerAlive: Player;
  private playerDead: Player;
  private phaser: Phaser.Scene;
  //  private gameOverText: Phaser.GameObjects.Text;

  constructor(){
    this.renderEngine = new RenderEngine(/* RenderEngine parameters */);
    this.level = {elements:[]}; //Level(/* parametres Level */);
    this.playerAlive = new Player(/* parametres Player */);
    this.playerDead = new Player(/* parametres Player */);

    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: true
            }
        },
        scene: [GameScene]
    };
    var phaser = new Phaser.Game(config);
  }

  switchToUser(){

  }

  updateElements(delta){

  }
}
