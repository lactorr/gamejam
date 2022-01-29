import {InputManager} from '../classes/inputManager';
import {LevelLoader} from '../classes/levelLoader';
import {Level} from '../classes/level';
import {Player} from '../classes/player';
import constants from '../constants';
//levels
import level1 from '../assets/levels/level0.json';
//images
import assetPlatform from '../assets/images/platform.png';
import assetCatAnimA from '../assets/images/cat_anim_a.png';
import assetCatAnimD from '../assets/images/cat_anim_d.png';
import assetCatSitA from '../assets/images/catalivesit.png';
import assetCatSitD from '../assets/images/catdeadsit.png';
import assetBoxFixe1 from '../assets/images/boxfixe01.png';
import assetBoxFixe1d from '../assets/images/boxfixe01d.png';
import assetPointLive from '../assets/images/pointlive.png';
import assetPointDeath from '../assets/images/pointdeath.png';
import assetBoxLine from '../assets/images/boxline.png';
import assetBoxDoorLine from '../assets/images/doorline.png';
import assetScientist from '../assets/images/scientistline.png';
import assetLine from '../assets/images/line.png';
import assetBoxBackground1A from '../assets/images/framea1.png';
import assetBoxBackground2A from '../assets/images/framea2.png';
import assetBoxBackground3A from '../assets/images/framea3.png';
import assetBoxBackground4A from '../assets/images/framea4.png';
import assetBoxBackground5A from '../assets/images/framea5.png';
import assetBoxBackground1D from '../assets/images/framed1.png';
import assetBoxBackground2D from '../assets/images/framed2.png';
import assetBoxBackground3D from '../assets/images/framed3.png';
import assetBoxBackground4D from '../assets/images/framed4.png';
import assetBoxBackground5D from '../assets/images/framed5.png';
//sounds
import { SoundManager } from '../classes/soundManager';
import assetFond from '../assets/images/fond.png';
import {addDebugText, clearDebugText} from './hud';

let ground;
let ceil;
let floor;
let wallL, wallR;
let cursors;
let platform;
let box1;
let box1d;
let t = 0;


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
  private fondImage: Phaser.GameObjects.Image;
  private fondGroup: Phaser.GameObjects.Group;
  private gameStarted: boolean = false;
  private gameIsOver: boolean = false;
  private soundManager: SoundManager;

  private boxBackgroundA: Phaser.GameObjects.Image[];
  private boxBackgroundD: Phaser.GameObjects.Image[];
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
    this.load.spritesheet('cataliveSit', assetCatSitA, {frameWidth : 250, frameHeight : 157});
    this.load.spritesheet('catdeadSit', assetCatSitD, {frameWidth : 250, frameHeight : 157});
    this.load.image('blockNtrAlive', assetBoxFixe1);
    this.load.image('blockNtrDead', assetBoxFixe1d);
    this.load.image('switchAlive', assetPointLive);
    this.load.image('switchDead', assetPointDeath);
    // this.load.image('boxline', assetBoxLine);
    // this.load.image('doorline', assetBoxDoorLine);
    // this.load.image('scientistline', assetScientist);
    // this.load.image('line', assetLine);
    this.load.image('boxBackground1A', assetBoxBackground1A);
    this.load.image('boxBackground2A', assetBoxBackground2A);
    this.load.image('boxBackground3A', assetBoxBackground3A);
    this.load.image('boxBackground4A', assetBoxBackground4A);
    this.load.image('boxBackground5A', assetBoxBackground5A);
    this.load.image('boxBackground1D', assetBoxBackground1D);
    this.load.image('boxBackground2D', assetBoxBackground2D);
    this.load.image('boxBackground3D', assetBoxBackground3D);
    this.load.image('boxBackground4D', assetBoxBackground4D);
    this.load.image('boxBackground5D', assetBoxBackground5D);
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
    for (let i=1; i!=6; ++i) {
      this.boxBackgroundA[i] = this.add.image(0, 0, `boxBackground${6-i}A`).setOrigin(0.5, 1);
      this.boxBackgroundA[i].setDepth(-2);
      this.boxBackgroundA[i].setDisplaySize(957, 280);
      //this.boxBackgroundA[i].setVisible(false);
    }
    this.boxBackgroundD = [];
    for (let i=1; i!=6; ++i) {
      this.boxBackgroundD[i] = this.add.image(0, 0, `boxBackground${i}D`).setOrigin(0.5, 0);
      this.boxBackgroundD[i].setDepth(-2);
      this.boxBackgroundD[i].setDisplaySize(957, 280);
      //this.boxBackgroundD[i].setVisible(false);
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
    var keyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    keyObj.on('up', function() {
      this.scene.restart();
    }, this);

    //Pause
    var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keyEnter.on('up', function() {
      console.log('pause');
      this.scene.pause();
      this.scene.sleep('HUDScene');
      console.log('HUD enlevé');
      this.scene.launch('PauseScreen');
    }, this);

    // ANIMATIONS CATALIVE
    this.anims.create({
      key: 'sit-alive',
      frames: this.anims.generateFrameNumbers('cataliveSit', {start: 0, end: 0}),
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
      key: 'sit-dead',
      frames: this.anims.generateFrameNumbers('catdeadSit', {start: 0, end: 0}),
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



      //Conditions de défaite
      //Un chat est écrasé par une boite
      this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [this.level.blockGroup, ceil, floor], cPerdu);
      //Un chat est écrasé par le plafond
      this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [ceil, floor] , cPerdu);
      //Le chrono est terminé
      var timerEvent;
      timerEvent = this.time.addEvent({ delay: constants.TIMER, callback: cPerdu, callbackScope: this});


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
    for (let i=0; i!=6; ++i) {
      if (this.boxBackgroundA[i]) {
        this.boxBackgroundA[i].x = boxOffset;
        this.boxBackgroundA[i].setVisible(false);
      }
      if (this.boxBackgroundD[i]) {
        this.boxBackgroundD[i].x = boxOffset;
        this.boxBackgroundD[i].setVisible(false);
      }
      /*this.boxBackgroundA[1].x = boxOffset;
      this.boxBackgroundA[2].x = boxOffset;
      this.boxBackgroundA[3].x = boxOffset;
      this.boxBackgroundA[4].x = boxOffset;*/
    }
    addDebugText(groundIndex);
    const groundIndexA = Math.min(5, groundIndex);
    const groundIndexD = Math.max(1, Math.min(5, groundIndex-4));
    addDebugText(groundIndexA);
    addDebugText(groundIndexD);
    this.boxBackgroundA[groundIndexA].setVisible(true);
    this.boxBackgroundD[groundIndexD].setVisible(true);
    //this.boxBackgroundA[groundIndex].setVisible(true);
    //this.boxBackground1D.x = boxOffset;
    this.gameAreaMask.geometryMask.x = boxOffset;
    // this.lineImage.x = boxOffset;
    // this.doorImage.x = boxOffset + (lineWidth/2);
    var completePercent = ( boxOffset / Number(this.level.levelWidth));
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
    if (!this.gameStarted) {
      return;
    }

    const inputData = this.inputManager.handleInputs();
    clearDebugText();

    const boxOffset = (this.playerAlive.gameObject.x + this.playerDead.gameObject.x)*.5;
    this.updateFixedImages(boxOffset);
    this.cameras.main.setScroll( boxOffset - constants.GAME_WIDTH/2, -300);
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
