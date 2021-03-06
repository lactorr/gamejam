import {InputManager} from '../classes/inputManager';
import {LevelLoader} from '../classes/levelLoader';
import {Level} from '../classes/level';
import {Player} from '../classes/player';
import constants from '../constants';
//levels
import level0 from '../assets/levels/level1.json';
//images
import assetPlatform from '../assets/images/platform.png';
import assetCatAnimA from '../assets/images/cat_anim_a.png';
import assetCatAnimD from '../assets/images/cat_anim_d.png';
import assetCatSitAR from '../assets/images/catalivesit.png';
import assetCatSitAL from '../assets/images/catalivesit-l.png';
import assetCatSitDR from '../assets/images/catdeadsit.png';
import assetCatSitDL from '../assets/images/catdeadsit-l.png';
import assetBoxFixe1 from '../assets/images/boxfixe01.png';
import assetBoxFixe1d from '../assets/images/boxfixe01d.png';
import assetPointLive from '../assets/images/pointlive.png';
import assetPointDeath from '../assets/images/pointdeath.png';
import assetBoxBackground9 from '../assets/images/box-9.png';
import assetBoxBackground8 from '../assets/images/box-8.png';
import assetBoxBackground7 from '../assets/images/box-7.png';
import assetBoxBackground6 from '../assets/images/box-6.png';
import assetBoxBackground5 from '../assets/images/box-5.png';
import assetBoxBackground4 from '../assets/images/box-4.png';
import assetBoxBackground3 from '../assets/images/box-3.png';
import assetBoxBackground2 from '../assets/images/box-2.png';
import assetBoxBackground1 from '../assets/images/box-1.png';
import assetKeyLeftRight from '../assets/images/touches_lr.png';
import assetKeyJump from '../assets/images/touches_jump.png';
import assetKeySwitch from '../assets/images/touches_switch.png';
import assetKeyReset from '../assets/images/touches_reset.png';
import assetKeyPause from '../assets/images/touches_pause.png';
import assetCheckpoint from '../assets/images/checkpoint.png';
import assetCheckpointValidated from '../assets/images/checkpointValidated.png';
import assetCheckpointExit from '../assets/images/checkpointExit.png';

//sounds
import { soundManager } from '../classes/soundManager';
import assetFond from '../assets/images/fond.png';
import {addDebugText, clearDebugText} from './hud';
import soundCheckpoint from '../assets/sounds/checkpoint.mp3';

let ground;
let ceil;
let floor;
let wallL, wallR;

const audioCheckpoint = new Audio(soundCheckpoint);
audioCheckpoint.volume = 0.6;

type GameState = {
  groundPositionY: number,
  catsPositionX: number,
};

// noinspection JSUnusedGlobalSymbols
export class GameScene extends Phaser.Scene {
  private inputManager: InputManager;
  public playerAlive: Player;
  public playerDead: Player;
  public level: Level;
  private controlledPlayer: Player;
  private targetGroundPositionY: number = 0;
  private currentGroundPositionY: number = 0;
  private levelLoader: LevelLoader;
  // Line images
  private fondGroup: Phaser.GameObjects.Group;
  public gameStarted: boolean = false;
  public gamePaused: boolean = false;
  public gameIsOver: boolean = false;
  public lastGameState: GameState;

  private boxBackgroundA: Phaser.GameObjects.Image[];
  private gameAreaMask: Phaser.Display.Masks.GeometryMask;

  private winAnimation: boolean = false;
  public isWin: boolean = false;

  constructor () {
    super('GameScene');
  }

  startGame() {
    console.log('START GAME');
    this.gameStarted = true;
    this.gameIsOver = false;
    soundManager.startMusic();
  }

  setInputManager(inputManager: InputManager) {
    this.inputManager = inputManager;
  }

  preload() {
    this.load.json('levelData', level0);
    this.load.image('ground', assetPlatform);
    this.load.spritesheet('catalive', assetCatAnimA, {frameWidth : 62, frameHeight : 39});
    this.load.spritesheet('catdead', assetCatAnimD, {frameWidth : 62, frameHeight : 39});
    this.load.spritesheet('cataliveSitR', assetCatSitAR, {frameWidth : 62, frameHeight : 39});
    this.load.spritesheet('cataliveSitL', assetCatSitAL, {frameWidth : 62, frameHeight : 39});
    this.load.spritesheet('catdeadSitR', assetCatSitDR, {frameWidth : 62, frameHeight : 39});
    this.load.spritesheet('catdeadSitL', assetCatSitDL, {frameWidth : 62, frameHeight : 39});
    this.load.image('keyLeftRight', assetKeyLeftRight);
    this.load.image('keyJump', assetKeyJump);
    this.load.image('keySwitch', assetKeySwitch);
    this.load.image('keyReset', assetKeyReset);
    this.load.image('keyPause', assetKeyPause);
    this.load.image('blockNtrAlive', assetBoxFixe1);
    this.load.image('blockNtrDead', assetBoxFixe1d);
    this.load.image('switchAlive', assetPointLive);
    this.load.image('switchDead', assetPointDeath);
    this.load.image('checkpoint', assetCheckpoint);
    this.load.image('checkpointValidated', assetCheckpointValidated);
    this.load.image('checkpointExit', assetCheckpointExit);

    this.load.image('boxBackground9', assetBoxBackground9);
    this.load.image('boxBackground8', assetBoxBackground8);
    this.load.image('boxBackground7', assetBoxBackground7);
    this.load.image('boxBackground6', assetBoxBackground6);
    this.load.image('boxBackground5', assetBoxBackground5);
    this.load.image('boxBackground4', assetBoxBackground4);
    this.load.image('boxBackground3', assetBoxBackground3);
    this.load.image('boxBackground2', assetBoxBackground2);
    this.load.image('boxBackground1', assetBoxBackground1);

    this.load.image('fond', assetFond);
  }

  create() {
    this.gameIsOver = false;
    this.winAnimation = false;
    this.currentGroundPositionY = 0;
    this.targetGroundPositionY = 0;
    this.levelLoader = new LevelLoader(this);
    this.inputManager = new InputManager(this);
    this.lastGameState = {
      groundPositionY: 0,
      catsPositionX: 40,
    };

    this.cameras.main.centerOn(constants.GAME_WIDTH/2, 0);
    // On peut pas avoir Y qui va vers le haut ca me tend T_T - xurei
    this.cameras.main.setBounds(-1000, -1000, 10000, 2000);
    this.physics.world.setBounds(-1000, -1000, 10000, 2000);

    // GAME AREA
    this.boxBackgroundA = [];
    for (let i=1; i<10; ++i) {
      this.boxBackgroundA[i] = this.add.image(0, 0, `boxBackground${i}`).setOrigin(0.5, 0.5);
      this.boxBackgroundA[i].setDepth(-2);
      this.boxBackgroundA[i].setDisplaySize(957, 560);
      //this.boxBackgroundA[i].setVisible(false);
    }

    //checkpoint = game.add.tileSprite(0, 0, 800, 600, 'checkpointTile');
    const shape1 = (this.make.graphics as any)().fillStyle(0xffffff).fillRect(
      -constants.GAMEAREA_WIDTH/2, -constants.GAMEAREA_HEIGHT/2, constants.GAMEAREA_WIDTH, constants.GAMEAREA_HEIGHT);
    this.gameAreaMask = shape1.createGeometryMask();

    this.level = this.levelLoader.parse( this.cache.json.get('levelData'), this.gameAreaMask);

    this.add.image(this.level.levelWidth + constants.BLOCKW, 0, 'checkpointExit')
      .setDisplaySize(constants.BLOCKH, constants.GAMEAREA_HEIGHT)
      .setMask(this.gameAreaMask)
      .setDepth(-2);

    ground = this.physics.add.image(0, 0, 'ground').setDisplaySize(constants.GAME_WIDTH, 12);
    ground.setImmovable(true);
    ground.setDepth(-1);

    ceil = this.physics.add.image(0, -constants.GAMEAREA_HEIGHT/2 - 16, 'ground').setDisplaySize(constants.GAME_WIDTH, 2);
    ceil.setImmovable(true);
    ceil.setDepth(-1);
    ceil.setVisible(false);

    floor = this.physics.add.image(0, constants.GAMEAREA_HEIGHT/2 + 16, 'ground').setDisplaySize(constants.GAME_WIDTH, 2);
    floor.setImmovable(true);
    floor.setDepth(-1);
    floor.setVisible(false);

    wallL = this.physics.add.image(constants.GAMEAREA_WIDTH/2, 0, 'ground').setDisplaySize(20, constants.GAME_HEIGHT);
    wallL.setOrigin(1, 0.5);
    wallL.setImmovable(true);
    wallL.setDepth(-1);
    wallL.setVisible(false);

    wallR = this.physics.add.image(constants.GAMEAREA_WIDTH/2, 0, 'ground').setDisplaySize(20, constants.GAME_HEIGHT);
    wallR.setOrigin(0, 0.5);
    wallR.setImmovable(true);
    wallR.setDepth(-1);
    wallR.setVisible(false);

    this.add.image(30, -constants.GAMEAREA_HEIGHT/4-constants.BLOCKH/2-10, 'keyLeftRight').setAlpha(0.8).setMask(this.gameAreaMask);
    this.add.image(30, -constants.GAMEAREA_HEIGHT/4-constants.BLOCKH/2+25, 'keyJump').setAlpha(0.8).setMask(this.gameAreaMask);
    this.add.image(30 + constants.BLOCKW*9, -constants.GAMEAREA_HEIGHT/4-constants.BLOCKH/2, 'keySwitch').setAlpha(0.8).setMask(this.gameAreaMask);
    this.add.image(30 + constants.BLOCKW*17, -constants.GAMEAREA_HEIGHT/4-2*constants.BLOCKH/2-15, 'keyReset').setAlpha(0.8).setMask(this.gameAreaMask);
    this.add.image(30 + constants.BLOCKW*17, -constants.GAMEAREA_HEIGHT/4-constants.BLOCKH/2+20, 'keyPause').setAlpha(0.8).setMask(this.gameAreaMask);

    //Generate background
    const fondImages = [];
    for (let x = 0; x < this.level.levelWidth + 1600; x += 1600) {
      fondImages.push(this.add.image(x, 0, 'fond'));
    }

    this.fondGroup = this.add.group(fondImages).setDepth(-10);

    this.playerAlive = new Player(this, true);
    this.playerDead = new Player(this, false);
    this.controlledPlayer = this.playerAlive;
    this.isWin = false;

    //Restart
    let keyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    keyObj.on('up', function() {
      this.resetToCheckpoint();
    }, this);

    //Pause
    let keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keyEnter.on('up', function() {
      this.gamePaused = true;
      this.scene.pause();
      this.scene.launch('PauseScreen');
    }, this);

    this.createAnimations();

    this.physics.add.collider([this.playerAlive.gameObject, this.playerDead.gameObject], [ground, floor, ceil, wallL, wallR]);
    this.physics.add.collider(this.playerAlive.gameObject, this.playerDead.gameObject);

    this.physics.add.collider(
        [ this.playerAlive.gameObject, this.playerDead.gameObject ],
        this.level.collisionGroup
    );

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

    //Conditions de d??faite
    //Un chat est ??cras?? par une boite
    this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [this.level.collisionGroup, ceil, floor], this.resetToCheckpoint.bind(this));
    //Un chat est ??cras?? par le plafond
    this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [ceil, floor] , this.resetToCheckpoint.bind(this));

    soundManager.updateMusicRatio(0);
  }

  gameOver() {
    console.log(`TRIGGER gameOver`);
    this.gameIsOver = true;
  }

  resetToCheckpoint() {
    this.playerAlive.gameObject.setPosition(this.lastGameState.catsPositionX, this.lastGameState.groundPositionY - 10);
    this.playerAlive.currentDirection = 1;
    this.playerDead.gameObject.setPosition(this.lastGameState.catsPositionX, this.lastGameState.groundPositionY + 10);
    this.playerDead.currentDirection = 1;

    this.targetGroundPositionY = this.lastGameState.groundPositionY;
    this.currentGroundPositionY = this.lastGameState.groundPositionY;
    ground.y = this.currentGroundPositionY;

    const setSwitchState = (switchElement: any) => {
      if (switchElement.body.x >= this.lastGameState.catsPositionX) {
        switchElement.enableBody(false, switchElement.body.x, switchElement.body.y, true, true);
      }
    }
    this.level.switchDeadGroup.getChildren().forEach(setSwitchState);
    this.level.switchAliveGroup.getChildren().forEach(setSwitchState);
  }

  resetGameState() {
    this.gameIsOver = false;
    this.lastGameState = {
      groundPositionY: 0,
      catsPositionX: 0,
    };
    this.resetToCheckpoint();
    this.updateCheckpointImages();
  }

  createAnimations() {
    // ANIMATIONS CATALIVE
    this.anims.create({
      key: 'sit-alive-right',
      frames: this.anims.generateFrameNumbers('cataliveSitR', {start: 0, end: 0}),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'sit-alive-left',
      frames: this.anims.generateFrameNumbers('cataliveSitL', {start: 0, end: 0}),
      frameRate: 1,
      repeat: -1
    });

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
      key: 'sit-dead-right',
      frames: this.anims.generateFrameNumbers('catdeadSitR', {start: 0, end: 0}),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'sit-dead-left',
      frames: this.anims.generateFrameNumbers('catdeadSitL', {start: 0, end: 0}),
      frameRate: 1,
      repeat: -1
    });

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
  }

  updateFixedImages(boxOffset) {
    let groundIndex = Math.ceil(this.currentGroundPositionY / constants.BLOCKH) + 5;
    for (let i=1; i!=10; ++i) {
      if (this.boxBackgroundA[i]) {
        this.boxBackgroundA[i].x = boxOffset;
        this.boxBackgroundA[i].setVisible(false);
      }
    }
    const groundIndexA = Math.min(9, groundIndex);
    this.boxBackgroundA[groundIndexA].setVisible(true);
    this.gameAreaMask.geometryMask.x = boxOffset;
    ground.x = boxOffset;
    floor.x = boxOffset;
    ceil.x = boxOffset;
    wallL.x = boxOffset - constants.GAMEAREA_WIDTH/2;
    wallR.x = boxOffset + constants.GAMEAREA_WIDTH/2;
  }

  update(time, delta) {
    this.inputManager.updateInputData();
    clearDebugText();
    if (!this.gameStarted) {
      return;
    }

    //Sc??ne de GameOver
    if(this.gameIsOver) {
      this.scene.stop('HUDScene');
      this.scene.sleep();
      this.scene.launch('GameOver');
    }

    const inputData = this.inputManager.handleInputs();
    addDebugText(JSON.stringify(inputData, null, '  '));

    const boxOffset = (this.playerAlive.gameObject.x + this.playerDead.gameObject.x)*.5;
    const boxOffsetCapped = Math.min(this.level.levelWidth, boxOffset) - constants.GAME_WIDTH/2;
    this.updateFixedImages(boxOffset);
    this.cameras.main.setScroll(boxOffsetCapped, -constants.GAME_HEIGHT/2+50);
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
      ground.y = this.currentGroundPositionY;
      soundManager.updateMusicRatio(this.currentGroundPositionY/constants.BLOCKH);
    }
    if (this.playerDead.gameObject.y < ground.y) {
      this.playerDead.gameObject.y = ground.y+10;
    }
    if (this.playerAlive.gameObject.y > ground.y) {
      this.playerAlive.gameObject.y = ground.y-10;
    }

    this.fondGroup.setY(this.currentGroundPositionY);
    //this.fondGroup.setX(boxOffset * 0.5);
    let fondChildren = this.fondGroup.getChildren();
    for (let i = 0; i < fondChildren.length; i++) {
        let backgroundElement = fondChildren[i] as any;
        backgroundElement.x = (boxOffsetCapped*constants.PARALLAX) + i * backgroundElement.width;
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
    if(this.winAnimation === false) {
      this.playerAlive.updateAnimation(this.controlledPlayer === this.playerAlive, inputData, isTouchingFloor);
      this.playerDead.updateAnimation(this.controlledPlayer === this.playerDead, inputData, isTouchingFloor);
    }


    // DEBUG
    if (inputData.goLifePressed) {
      this.targetGroundPositionY += constants.BLOCKH;
    }
    else if (inputData.goDeathPressed) {
      this.targetGroundPositionY -= constants.BLOCKH;
    }

    if(this.controlledPlayer.gameObject.x >= (this.level.levelWidth + (constants.BLOCKW) * 2)){
      this.controlledPlayer.gameObject.setVelocityX(0);

      if(this.controlledPlayer === this.playerAlive) {
        if(this.playerDead.gameObject.x < (this.level.levelWidth + (constants.BLOCKW) * 2)){
          this.controlledPlayer = this.playerDead;
        } else{
          this.winAnimation = true;
        }
      }
      else{
        if(this.playerAlive.gameObject.x < (this.level.levelWidth + (constants.BLOCKW) * 2)){
          this.controlledPlayer = this.playerAlive;
        } else{
          this.winAnimation = true;
        }
      }
    }

    //animation de victoire
    if(this.winAnimation === true){
      this.playerAlive.gameObject.setVelocityX(constants.PLAYER_XVELOCITY*2);
      this.playerDead.gameObject.setVelocityX(constants.PLAYER_XVELOCITY*2);
      this.playerAlive.gameObject.anims.play(`right-alive`, true);
      this.playerDead.gameObject.anims.play(`right-dead`, true);
      if(!this.isWin && this.playerDead.gameObject.x > (this.level.levelWidth + constants.GAME_WIDTH)){
        this.scene.stop('HUDScene');
        this.scene.stop('GameScene');
        this.scene.launch('Victory');
        this.isWin = true;
      }
    }

    // Checkpoints
    this.level.checkpoints.forEach((checkPointX) => {
      if (this.lastGameState.catsPositionX < checkPointX && this.playerAlive.gameObject.body.x >= checkPointX && this.playerDead.gameObject.body.x >= checkPointX) {
        console.log('CHECKPOINT reached at', checkPointX);
        audioCheckpoint.currentTime = 0;
        audioCheckpoint.play();
        this.lastGameState.groundPositionY = 0;
        this.lastGameState.catsPositionX = checkPointX + constants.BLOCKW;
        this.updateCheckpointImages();
      }
    });
  }

  updateCheckpointImages() {
    this.level.checkpointGroup.getChildren().forEach((checkPointObject:any) => {
      checkPointObject.setVisible(checkPointObject.x >= this.lastGameState.catsPositionX);
    });
    this.level.checkpointValidatedGroup.getChildren().forEach((checkPointObject:any) => {
      checkPointObject.setVisible(checkPointObject.x < this.lastGameState.catsPositionX);
    });
  }
}
