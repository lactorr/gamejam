/*
  Game stuff
*/
import * as Phaser from 'phaser';
import { InputData, InputManager } from './inputManager';
import { Player } from './player';
import { Level } from './level';
import { RenderEngine } from './renderEngine';
import { GameScene } from '../scenes/gameScene';
import { HUDScene } from '../scenes/hud';
import { MainMenuScene } from '../scenes/MainMenu';

// TODO: Remove soon
/** Todo: test */
/* TODO: test */

export class Game {
  private gameRunning = true;
  private renderEngine: RenderEngine;
  private level: Level;
  private gameScene: GameScene;
  private inputManager: InputManager;
  //  private gameOverText: Phaser.GameObjects.Text;

  constructor(){
    this.renderEngine = new RenderEngine(/* RenderEngine parameters */);
    this.level = {elements:[]}; //Level(/* parametres Level */);

    //this.gameScene = new GameScene();

    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: true,
            }
        },
        scene: [ GameScene, HUDScene, MainMenuScene ]
    };
    const phaser = new Phaser.Game(config);
    phaser.events.on('ready', () => {
        //TODO ca ressemble pas à une façon logique de faire. Il doit y avoir un autre moyen
        this.gameScene = phaser.scene.getScenes(false)[0] as GameScene;

        this.inputManager = new InputManager(this.gameScene);
        this.gameScene.setInputManager(this.inputManager);
        phaser.scene.run('HUD');

        console.log('GAME READY, GL HF');
    });
  }

  switchToUser(){

  }

  updateElements(delta){

  }
}
