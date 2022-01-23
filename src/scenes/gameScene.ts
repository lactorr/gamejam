import {InputManager} from '../classes/inputManager';
import {LevelLoader} from '../classes/levelLoader';
import {Level} from '../classes/level';
import {Player} from '../classes/player';
import constants from '../constants';

import level1 from '../assets/levels/level2.json';
import assetPlatform from '../assets/images/platform.png';
import assetCatAnimA from '../assets/images/cat_anim_a.png';
import assetCatAnimD from '../assets/images/cat_anim_d.png';
import assetBoxFixe1 from '../assets/images/boxfixe01.png';
import assetBoxFixe1d from '../assets/images/boxfixe01d.png';
import assetPointLive from '../assets/images/pointlive.png';
import assetPointDeath from '../assets/images/pointdeath.png';
import assetBoxLine from '../assets/images/boxline.png';
import assetBoxDoorLine from '../assets/images/doorline.png';
import assetScientist from '../assets/images/scientistline.png';
import assetLine from '../assets/images/line.png';

import {addDebugText, clearDebugText} from './hud';

let ground;
let cursors;
let platform;
let box1;
let box1d;
let t = 0;


// noinspection JSUnusedGlobalSymbols
export class GameScene extends Phaser.Scene {
  private inputManager: InputManager;
  private playerAlive: Player;
  private playerDead: Player;
  private level: Level;
  private controlledPlayer: Player;
  private targetGroundPositionY: number = 0;
  private currentGroundPositionY: number = 0;
  private levelLoader: LevelLoader;
  // Line images
  private lineImage: Phaser.GameObjects.Image;
  private boxImage: Phaser.GameObjects.Image;
  private doorImage: Phaser.GameObjects.Image;
  private scientistImage: Phaser.GameObjects.Image;

  setInputManager(inputManager: InputManager) {
    this.inputManager = inputManager;
  }

  preload() {
    this.load.json('levelData', level1);
    this.load.image('ground', assetPlatform);
    this.load.spritesheet('catalive', assetCatAnimA, {frameWidth : 250, frameHeight : 157});
    this.load.spritesheet('catdead', assetCatAnimD, {frameWidth : 250, frameHeight : 157});
    this.load.image('blockNtrAlive', assetBoxFixe1);
    this.load.image('blockNtrDead', assetBoxFixe1d);
    this.load.image('switchAlive', assetPointLive);
    this.load.image('switchDead', assetPointDeath);
    this.load.image('boxline', assetBoxLine);
    this.load.image('doorline', assetBoxDoorLine);
    this.load.image('scientistline', assetScientist);
    this.load.image('line', assetLine);
  }

  create() {
    this.levelLoader = new LevelLoader(this);

    this.cameras.main.centerOn(400, 0);
    // On peut pas avoir Y qui va vers le haut ca me tend T_T - xurei
    // this.cameras.main.setO
    this.cameras.main.setBounds(-1000, -1000, 10000, 2000);
    this.physics.world.setBounds(-1000, -1000, 10000, 2000);

    // LIGNE DU POURSUIVANT
    this.lineImage = this.add.image(50, 250, 'line')
        .setOrigin(0.5, 0.5)
        .setSize(2219, 49)
        .setDisplaySize(2219 * 0.3, 49 * 0.3);
    this.boxImage = this.add.image(100, 250, 'boxline')
        .setOrigin(0.5, 0.5)
        .setSize(207, 109)
        .setDisplaySize(207 * 0.4, 109 * 0.4);
    this.doorImage = this.add.image(680, 250, 'doorline')
        .setOrigin(0.5, 0.5)
        .setSize(197, 240)
        .setDisplaySize(197 * 0.3, 240 * 0.3);
    this.scientistImage = this.add.image(30, 250, 'scientistline')
        .setOrigin(0.5, 0.5)
        .setSize(178, 249)
        .setDisplaySize(178 * 0.4, 249 * 0.4);

    this.level = this.levelLoader.parse( this.cache.json.get('levelData'));

    ground = this.physics.add.image(0, 0, 'ground')
                 .setOrigin(0, 0.5)
                 .setSize(800, 20)
                 .setDisplaySize(800, 4);
    ground.setImmovable(true);

    this.playerAlive = new Player(this, true);
    this.playerDead = new Player(this, false);
    this.controlledPlayer = this.playerAlive;

    // ANIMATIONS CATALIVE
    this.anims.create({
      key: 'left-alive',
      frames: this.anims.generateFrameNumbers('catalive', {start: 0, end: 9}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle-alive-left',
      frames: [ {key: 'catalive', frame: 9} ],
      frameRate: 20
    });
    this.anims.create({
      key: 'idle-alive-right',
      frames: [ {key: 'catalive', frame: 10} ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right-alive',
      frames: this.anims.generateFrameNumbers('catalive', {start: 10, end: 19}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jump-alive-left',
      frames: [ {key: 'catalive', frame: 6} ],
      frameRate: 10,
    });
    this.anims.create({
      key: 'jump-alive-right',
      frames: [ {key: 'catalive', frame: 14} ],
      frameRate: 10,
    });

    // ANIMATIONS CATDEAD
    this.anims.create({
      key: 'left-dead',
      frames: this.anims.generateFrameNumbers('catdead', {start: 0, end: 9}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle-dead-left',
      frames: [ {key: 'catdead', frame: 9} ],
      frameRate: 20
    });

    this.anims.create({
      key: 'idle-dead-right',
      frames: [ {key: 'catdead', frame: 10} ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right-dead',
      frames: this.anims.generateFrameNumbers('catdead', {start: 10, end: 19}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jump-dead-left',
      frames: [ {key: 'catdead', frame: 6} ],
      frameRate: 10,
    });

    this.anims.create({
      key: 'jump-dead-right',
      frames: [ {key: 'catdead', frame: 14} ],
      frameRate: 10,
    });

    this.physics.add.collider([this.playerAlive.gameObject, this.playerDead.gameObject], ground);
    this.physics.add.collider(this.playerAlive.gameObject, this.playerDead.gameObject);

    this.physics.add.collider(
        [ this.playerAlive.gameObject, this.playerDead.gameObject ],
        this.level.blockGroup);

        this.physics.add.overlap(
            [ this.playerAlive.gameObject, this.playerDead.gameObject ],
            this.level.switchAliveGroup, (player, switchAlive: any) => {
              switchAlive.disableBody(true, true);
              this.targetGroundPositionY += constants.BLOCKH;
            }, null, this
        );

        this.physics.add.overlap(
            [ this.playerAlive.gameObject, this.playerDead.gameObject ],
            this.level.switchDeadGroup, (player, switchAlive: any) => {
              switchAlive.disableBody(true, true);
              this.targetGroundPositionY -= constants.BLOCKH;
            }, null, this
        );
  }

  updateLine( boxOffset ){
    var lineWidth = this.lineImage.displayWidth;
    this.scientistImage.x = boxOffset - (lineWidth/2);
    this.lineImage.x = boxOffset;
    this.doorImage.x = boxOffset + (lineWidth/2);
    var completePercent = ( boxOffset / Number(this.level.levelWidth));
    this.boxImage.x = this.scientistImage.x + lineWidth*completePercent;
  }

  update(time, delta) {
    const inputData = this.inputManager.handleInputs();
    clearDebugText();

    var boxOffset = (this.playerAlive.gameObject.x + this.playerDead.gameObject.x)*.5;
    this.updateLine(boxOffset);
    this.cameras.main.setScroll( boxOffset - 400, -300);
    ground.x = boxOffset ;
    // ground.setPosition(0,Math.sin(delta/1000)*100+300);

    // UPDATE GROUND IF NEEDED
    const groundPositionDiff = this.targetGroundPositionY - this.currentGroundPositionY;
    if (Math.abs(groundPositionDiff) > 0.000001) {
      if (groundPositionDiff < 0) {
        this.currentGroundPositionY -= delta * constants.BLOCKH * constants.GROUND_SPEED;
        this.currentGroundPositionY = Math.max(this.currentGroundPositionY, this.targetGroundPositionY);
      }
      else if (groundPositionDiff > 0) {
        this.currentGroundPositionY += delta * constants.BLOCKH * constants.GROUND_SPEED;
        this.currentGroundPositionY = Math.min(this.currentGroundPositionY, this.targetGroundPositionY);
      }
      ground.setPosition(0, this.currentGroundPositionY);

      if (this.playerDead.gameObject.y < ground.y) {
        this.playerDead.gameObject.y = ground.y;
      }
      if (this.playerAlive.gameObject.y > ground.y) {
        this.playerAlive.gameObject.y = ground.y;
      }
    }

    // CAT precalc useful values
    let mult = 1;
    if (this.controlledPlayer.gameObject.body.gravity.y < 0) {
      mult = -1;
    }
    const isTouchingFloor = (
      (mult > 0 && this.controlledPlayer.gameObject.body.touching.down) ||
      (mult < 0 && this.controlledPlayer.gameObject.body.touching.up)
    );

    // LEFT-RIGHT
    this.controlledPlayer.gameObject.setVelocityX(inputData.deltaX * constants.PLAYER_XVELOCITY);

    //Save the direction when not idle, so we can keep the current orientation when not moving
    if (inputData.deltaX !== 0) {
      if (inputData.deltaX > 0) {
        this.controlledPlayer.currentDirection = 1;
      }
      else {
        this.controlledPlayer.currentDirection = -1;
      }
    }
    // JUMP
    if (inputData.jumpDown && isTouchingFloor) {
      this.controlledPlayer.gameObject.setVelocityY(mult * -constants.JUMP_VELOCITY);
    }

    // SWITCH
    if (inputData.switchPressed) {
      console.log('SWITCH PRESSED');
      if(this.controlledPlayer === this.playerAlive) {
        this.controlledPlayer.gameObject.setVelocityX(0);
        this.controlledPlayer = this.playerDead;
      }
      else /* if (this.controlledPlayer === this.playerDead) */ {
        this.controlledPlayer.gameObject.setVelocityX(0);
        this.controlledPlayer = this.playerAlive;
      }
    }


    // ANIMATIONS
    this.playerAlive.updateAnimation(this.controlledPlayer === this.playerAlive, inputData, isTouchingFloor);
    this.playerDead.updateAnimation(this.controlledPlayer === this.playerDead, inputData, isTouchingFloor);


    // DEBUG
    if (inputData.goLifePressed) {
      console.log('LIFE PRESSED');
      this.targetGroundPositionY += constants.BLOCKH;
    }
    else if (inputData.goDeathPressed) {
      console.log('DEATH PRESSED');
      this.targetGroundPositionY -= constants.BLOCKH;
    }

  }
}
