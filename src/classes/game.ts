/*
  Game stuff
*/
import * as Phaser from 'phaser';
import { InputData, InputManager } from './inputManager';
import { Player } from './player';
import { Level } from './level';
import { RenderEngine } from './renderEngine';
import { GameScene } from '../scenes/gameScene';
import { GameOver } from '../scenes/gameOver';
import { Victory } from '../scenes/victory';
import { HUDScene } from '../scenes/hud';
import { PauseScreen } from '../scenes/pauseScreen';
import constants from '../constants';
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
    //this.level = {elements:[]}; //Level(/* parametres Level */);

    //this.gameScene = new GameScene();

    let config = {
        type: Phaser.AUTO,
        width: constants.GAME_WIDTH,
        height: constants.GAME_HEIGHT,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false,
            }
        },
        scene: [ GameScene, HUDScene, MainMenuScene, PauseScreen, GameOver, Victory ]
    };
    const phaser = new Phaser.Game(config);
    phaser.events.on('ready', () => {
        //TODO ca ressemble pas à une façon logique de faire. Il doit y avoir un autre moyen
        this.gameScene = phaser.scene.getScene('GameScene') as GameScene;
        const mainMenuScene = phaser.scene.getScene('MainMenuScene');

        this.inputManager = new InputManager(mainMenuScene);
        this.gameScene.setInputManager(this.inputManager);
        phaser.scene.run('HUD');
        phaser.scene.run('MainMenuScene');

        (mainMenuScene as MainMenuScene).setInputManager(this.inputManager);

        console.log('GAME READY, GL HF');
    });
  }

  switchToUser(){

  }

  updateElements(delta){

  }
}
