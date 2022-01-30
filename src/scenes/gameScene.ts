import {InputManager} from '../classes/inputManager';
import {LevelLoader} from '../classes/levelLoader';
import {Level} from '../classes/level';
import {Player} from '../classes/player';
import constants from '../constants';
//levels
import level1 from '../assets/levels/level1.json';
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

//sounds
import { SoundManager } from '../classes/soundManager';
import assetFond from '../assets/images/fond.png';
import {addDebugText, clearDebugText} from './hud';

let ground;
let ceil;
let floor;
let wallL, wallR;

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
  private gameStarted: boolean = false;
  private gameIsOver: boolean = false;
  private soundManager: SoundManager;

  private boxBackgroundA: Phaser.GameObjects.Image[];
  private gameAreaMask: Phaser.Display.Masks.GeometryMask;

  constructor () {
    super('GameScene');
  }

  startGame() {
    this.gameStarted = true;
    this.soundManager.startMusic();
    console.log('on start le game')
  }

  setInputManager(inputManager: InputManager) {
    this.inputManager = inputManager;
  }

  setSoundManager(soundManager: SoundManager){
    this.soundManager = soundManager;
  }

  preload() {
    this.soundManager = new SoundManager();
    this.load.json('levelData', level1);
    this.load.image('ground', assetPlatform);
    this.load.spritesheet('catalive', assetCatAnimA, {frameWidth : 250, frameHeight : 157});
    this.load.spritesheet('catdead', assetCatAnimD, {frameWidth : 250, frameHeight : 157});
    this.load.spritesheet('cataliveSitR', assetCatSitAR, {frameWidth : 250, frameHeight : 157});
    this.load.spritesheet('cataliveSitL', assetCatSitAL, {frameWidth : 250, frameHeight : 157});
    this.load.spritesheet('catdeadSitR', assetCatSitDR, {frameWidth : 250, frameHeight : 157});
    this.load.spritesheet('catdeadSitL', assetCatSitDL, {frameWidth : 250, frameHeight : 157});
    this.load.image('keyLeftRight', assetKeyLeftRight);
    this.load.image('keyJump', assetKeyJump);
    this.load.image('keySwitch', assetKeySwitch);
    this.load.image('keyReset', assetKeyReset);
    this.load.image('keyPause', assetKeyPause);
    this.load.image('blockNtrAlive', assetBoxFixe1);
    this.load.image('blockNtrDead', assetBoxFixe1d);
    this.load.image('switchAlive', assetPointLive);
    this.load.image('switchDead', assetPointDeath);

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
    this.currentGroundPositionY = 0;
    this.targetGroundPositionY = 0;

    console.log('on create la gamescene');
    console.log(this.input);
    this.levelLoader = new LevelLoader(this);

    this.cameras.main.centerOn(constants.GAME_WIDTH/2, 0);
    // On peut pas avoir Y qui va vers le haut ca me tend T_T - xurei
    this.cameras.main.setBounds(-1000, -1000, 10000, 2000);
    this.physics.world.setBounds(-1000, -1000, 10000, 2000);

    // LIGNE DU POURSUIVANT
    // this.lineImage = this.add.image(50, 370, 'line')
    //     .setOrigin(0.5, 0.5)
    //     .setSize(2219, 49)
    //     .setDisplaySize(2219 * 0.3, 49 * 0.3);
    // this.boxImage = this.add.image(100, 370, 'boxline')
    //     .setOrigin(0.5, 0.5)
    //     .setSize(207, 109)
    //     .setDisplaySize(207 * 0.4, 109 * 0.4);
    // this.doorImage = this.add.image(680, 370, 'doorline')
    //     .setOrigin(0.5, 0.5)
    //     .setSize(197, 240)
    //     .setDisplaySize(197 * 0.3, 240 * 0.3);
    // this.scientistImage = this.add.image(30, 370, 'scientistline')
    //     .setOrigin(0.5, 0.5)
    //     .setSize(178, 249)
    //     .setDisplaySize(178 * 0.4, 249 * 0.4);

    // GAME AREA
    this.boxBackgroundA = [];
    for (let i=1; i<10; ++i) {
      this.boxBackgroundA[i] = this.add.image(0, 0, `boxBackground${i}`).setOrigin(0.5, 0.5);
      this.boxBackgroundA[i].setDepth(-2);
      this.boxBackgroundA[i].setDisplaySize(957, 560);
      //this.boxBackgroundA[i].setVisible(false);
    }
    /*this.boxBackground1D = this.add.image(0, 0, 'boxBackground1D').setOrigin(0.5, 0);
    this.boxBackground1D.setDepth(-2);
    this.boxBackground1D.setDisplaySize(957, 280);   */
    //this.boxBackground1D.setRotation(Math.PI);

    const shape1 = (this.make.graphics as any)().fillStyle(0xffffff).fillRect(
      -constants.GAMEAREA_WIDTH/2, -constants.GAMEAREA_HEIGHT/2, constants.GAMEAREA_WIDTH, constants.GAMEAREA_HEIGHT);
    this.gameAreaMask = shape1.createGeometryMask();

    this.level = this.levelLoader.parse( this.cache.json.get('levelData'), this.gameAreaMask);

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
    for (let x = 0; x < this.level.levelWidth; x += 1600) {
      fondImages.push(this.add.image(x, 0, 'fond'));
    }

    this.fondGroup = this.add.group(fondImages).setDepth(-10);

    this.playerAlive = new Player(this, true);
    this.playerDead = new Player(this, false);
    this.controlledPlayer = this.playerAlive;

    //Restart
    let keyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    keyObj.on('up', function() {
      this.scene.restart();
    }, this);

    //Pause
    let keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keyEnter.on('up', function() {
      console.log('pause');
      this.scene.pause();
      this.scene.sleep('HUDScene');
      console.log('HUD enlevé');
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


    const cPerdu = () =>{
      console.log('ca touche');
      this.gameIsOver = true;
      console.log(this.gameIsOver)
    }

    const cGagne = () =>{
      console.log('cest la win');
      this.scene.sleep();
      this.scene.sleep('HUDScene');
      this.scene.launch('Victory');
    }

    //Conditions de défaite
    //Un chat est écrasé par une boite
    this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [this.level.collisionGroup, ceil, floor], cPerdu);
    //Un chat est écrasé par le plafond
    this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [ceil, floor] , cPerdu);
    //Le chrono est terminé
    let timerEvent = this.time.addEvent({ delay: constants.TIMER, callback: cPerdu, callbackScope: this});

    //Conditions de victoire
    // this.physics.add.overlap(this.boxImage, this.doorImage, cGagne);

    //Debug GameOver (touche suppr)
    // var keyDel = this.input.keyboard.addKey('delete');
    // keyDel.on('up', function() {
    //   this.gameIsOver = true;
    //   console.log('gameIsOver');
    // }, this);

    this.soundManager.updateMusicRatio(0);
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

    this.physics.add.collider([this.playerAlive.gameObject, this.playerDead.gameObject], [ground, floor, ceil, wallL, wallR]);
    this.physics.add.collider(this.playerAlive.gameObject, this.playerDead.gameObject);

    this.physics.add.collider(
        [ this.playerAlive.gameObject, this.playerDead.gameObject ],
        this.level.blockGroup);

        this.physics.add.overlap(
            [ this.playerAlive.gameObject, this.playerDead.gameObject ],
            this.level.switchAliveGroup, (player, switchAlive: any) => {
              switchAlive.disableBody(true, true);
              this.targetGroundPositionY += constants.BLOCKH;
              console.log(switchAlive.bonusId);
            }, null, this
        );

        this.physics.add.overlap(
            [ this.playerAlive.gameObject, this.playerDead.gameObject ],
            this.level.switchDeadGroup, (player, switchAlive: any) => {
              switchAlive.disableBody(true, true);
              this.targetGroundPositionY -= constants.BLOCKH;
              console.log(switchAlive.bonusId);
            }, null, this
        );


      const cPerdu = () =>{
        console.log('ca touche');
        this.gameIsOver = true;
        console.log(this.gameIsOver)
      }

      const cGagne = () =>{
        console.log('cest la win');
        this.scene.sleep();
        this.scene.sleep('HUDScene');
        this.scene.launch('Victory');
      }

      //Conditions de défaite
      //Un chat est écrasé par une boite
      this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [this.level.blockGroup, ceil, floor], cPerdu);
      //Un chat est écrasé par le plafond
      this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [ceil, floor] , cPerdu);


      //Debug GameOver (touche suppr)
      // var keyDel = this.input.keyboard.addKey('delete');
      // keyDel.on('up', function() {
      //   this.gameIsOver = true;
      //   console.log('gameIsOver');
      // }, this);

  }

  updateFixedImages(boxOffset){
    // var lineWidth = this.lineImage.displayWidth;
    // this.scientistImage.x = boxOffset - (lineWidth/2);
    let groundIndex = Math.ceil(this.currentGroundPositionY / constants.BLOCKH) + 5;
    for (let i=1; i!=10; ++i) {
      if (this.boxBackgroundA[i]) {
        this.boxBackgroundA[i].x = boxOffset;
        this.boxBackgroundA[i].setVisible(false);
      }
    }
    addDebugText(groundIndex);
    const groundIndexA = Math.min(9, groundIndex);
    addDebugText(groundIndexA);
    this.boxBackgroundA[groundIndexA].setVisible(true);
    this.gameAreaMask.geometryMask.x = boxOffset;
    // this.lineImage.x = boxOffset;
    // this.doorImage.x = boxOffset + (lineWidth/2);
    // let completePercent = ( boxOffset / Number(this.level.levelWidth));
    // this.boxImage.x = this.scientistImage.x + lineWidth*completePercent;
    ground.x = boxOffset;
    floor.x = boxOffset;
    ceil.x = boxOffset;
    wallL.x = boxOffset - constants.GAMEAREA_WIDTH/2;
    wallR.x = boxOffset + constants.GAMEAREA_WIDTH/2;

    //Bouger la tête du scientifique

  //   var timeline = this.tweens.createTimeline();

  //   timeline.add ({
  //       targets: this.scientistImage,
  //       x: 650,
  //       ease: 'Linear',
  //       duration: constants.TIMER
  //   });

  //       timeline.play();
  //       console.log(timeline);


  }

  update(time, delta) {
    this.inputManager.updateInputData();
    clearDebugText();
    if (!this.gameStarted) {
      addDebugText("NOT STARTED");
      return;
    }

    const inputData = this.inputManager.handleInputs();

    const boxOffset = (this.playerAlive.gameObject.x + this.playerDead.gameObject.x)*.5;
    this.updateFixedImages(boxOffset);
    this.cameras.main.setScroll( boxOffset - constants.GAME_WIDTH/2, -constants.GAME_HEIGHT/2+50);
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
      this.soundManager.updateMusicRatio(this.currentGroundPositionY/constants.BLOCKH);
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
        backgroundElement.x = (boxOffset*constants.PARALLAX) + i * backgroundElement.width;
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
    //Scène de GameOver
    if(this.gameIsOver){
      console.log('on charge le gameover');
      this.scene.sleep();
      this.scene.sleep('HUDScene');
      this.scene.launch('GameOver');
    }

      // Conditions de victoire

      if((this.playerAlive.gameObject.x > (this.level.levelWidth + (constants.BLOCKW) * 2))
        && (this.playerDead.gameObject.x > (this.level.levelWidth + (constants.BLOCKW) * 2))){
        console.log('Tadaaa');
        this.scene.sleep();
        this.scene.sleep('HUDScene');
        this.scene.launch('Victory');
      }

    // Avancée du scientist de 650 en constants.TIMER ms
    // this.scientistImage.setX = 30 + 650/timerEvent;

  }
}
