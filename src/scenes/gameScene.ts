import { InputManager } from '../classes/inputManager';
import { Player } from '../classes/player';
import { Level } from '../classes/level';
import { addDebugText, clearDebugText } from './hud';

let ground;
let cursors;
let platform;
let box1;
let box1d;
let t = 0;
let variables = {
  BLOCKW: 60,
  BLOCKH: 50,
  SWITCH_SIZE: 30,
  GROUND_SPEED: 0.005,
  JUMP_VELOCITY: 250,
  PLAYER_GRAVITY: 500,
  PLAYER_XVELOCITY: 70,
};

// noinspection JSUnusedGlobalSymbols
export class GameScene extends Phaser.Scene {
  private inputManager: InputManager;
  private playerAlive: Player;
  private playerDead: Player;
  private level: Level;
  private controlledPlayer: Player;
  private targetGroundPositionY: number = 0;
  private currentGroundPositionY: number = 0;

  setInputManager(inputManager: InputManager) {
    this.inputManager = inputManager;
  }

  preload() {
    this.load.image('sky', 'src/assets/images/sky.png');
    this.load.image('ground', 'src/assets/images/platform.png');
    this.load.image('star', 'src/assets/images/star.png');
    this.load.image('catalive', 'src/assets/images/catalive.png' /*{, frameWidth: 32, frameHeight: 48 }*/);
    this.load.image('catdead', 'src/assets/images/catdead.png');
    this.load.image('blockNtrAlive', 'src/assets/images/boxfixe01.png');
    this.load.image('blockNtrDead', 'src/assets/images/boxfixe01d.png');
    this.load.image('switchAlive', 'src/assets/images/pointlive.png');
    this.load.image('switchDead', 'src/assets/images/pointdeath.png');
  }

  create() {
    this.cameras.main.centerOn(400, 0);
    // On peut pas avoir Y qui va vers le haut ca me tend T_T - xurei
    //this.cameras.main.setO

  this.physics.world.setBounds(0, -1000, 10000, 2000);

    var levelBlocks = this.physics.add.group({
      immovable: true,
      defaultKey: 'blockNtrAlive',
    });
    //this.level = Level();
    this.level = { elements:[
      { x:2, y:-1, w:1, h:1, type: "blockNtrAlive" },
      { x:2, y:0, w:1, h:1, type: "blockNtrAlive" },
      { x:2, y:1, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:-2, w:1, h:1, type: "blockNtrAlive" },
      { x:7, y:-3, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:-1, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:0, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:1, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:-3, w:1, h:1, type: "switchAlive" },
      { x:3, y:2, w:1, h:1, type: "switchDead" },
    ]};

    var blocks = [];
    this.level.elements.map((element) => {
      var ex = element.x * variables.BLOCKW;
      var ey = element.y * variables.BLOCKH;

      switch(element.type){
        case "blockNtrAlive":
        levelBlocks.create(ex, ey, element.type).setOrigin(0,0).setDisplaySize(element.w * variables.BLOCKW, element.h * variables.BLOCKH);
        break;
        case "blockNtrDead":
        levelBlocks.create(ex, ey, element.type).setOrigin(0,0).setDisplaySize(element.w * variables.BLOCKW, element.h * variables.BLOCKH);
        case "switchAlive":
        levelBlocks.create(ex + (variables.BLOCKW-variables.SWITCH_SIZE)*0.5, ey + (variables.BLOCKH-variables.SWITCH_SIZE)*0.5, element.type).setOrigin(0,0).setDisplaySize(element.w * variables.SWITCH_SIZE, element.h * variables.SWITCH_SIZE);
        case "switchDead":
        levelBlocks.create(ex + (variables.BLOCKW-variables.SWITCH_SIZE)*0.5, ey + (variables.BLOCKH-variables.SWITCH_SIZE)*0.5, element.type).setOrigin(0,0).setDisplaySize(element.w * variables.SWITCH_SIZE, element.h * variables.SWITCH_SIZE);
        break;
        default:
        console.log("Type doesn't exists");
        break;
      }

    });

    ground = this.physics.add.image(0, 0, 'ground').setOrigin(0, 0.5).setSize(800, 20).setDisplaySize(800, 4);
    ground.setImmovable(true);
    //box1 = this.physics.add.image(400, 200, 'boxfixe01').setDisplaySize(328*0.3, 265*0.3);
    //box1d = this.physics.add.image(400, 400, 'boxfixe01d').setDisplaySize(328*0.3, 265*0.3);

    //box1.setImmovable(true);
    //box1d.setImmovable(true);

    this.playerAlive = new Player(this.physics.add.sprite(40, -50, 'catalive').setGravity(0, variables.PLAYER_GRAVITY).setMass(100).setSize(329, 172).setDisplaySize(109*0.6, 57*0.6));
    this.playerAlive.gameObject.setOrigin(0.5,1);
    this.playerDead = new Player(this.physics.add.sprite(40, 50, 'catdead').setGravity(0, -variables.PLAYER_GRAVITY).setMass(100).setSize(329, 172).setDisplaySize(109*0.6, 57*0.6));
    this.playerDead.gameObject.setOrigin(0.5,0);
    this.controlledPlayer = this.playerAlive;

    /*
      this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('catalive', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
    key: 'turn',
    frames: [ { key: 'catalive', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
  key: 'right',
  frames: this.anims.generateFrameNumbers('catalive', { start: 5, end: 8 }),
  frameRate: 10,
  repeat: -1
  });
  */
  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(
    this.playerAlive.gameObject,
    platform,
    function(_player, _platform) {
      if (_player.body.touching.up && _platform.body.touching.down) {
        /*
        DO SOMETHING
        */
      }
    });

    this.physics.add.collider([this.playerAlive.gameObject, this.playerDead.gameObject], ground);
    this.physics.add.collider(this.playerAlive.gameObject, this.playerDead.gameObject);

    this.physics.add.collider([this.playerAlive.gameObject, this.playerDead.gameObject], levelBlocks);

    this.physics.add.overlap([this.playerAlive.gameObject, this.playerDead.gameObject], [levelBlocks.key.switchAlive,levelBlocks.key.switchDead], collectSwitch, null, this);
  }

  update (time, delta) {
    const inputData = this.inputManager.handleInputs();

    //ground.setPosition(0,Math.sin(delta/1000)*100+300);

    // UPDATE GROUND IF NEEDED
    const groundPositionDiff = this.targetGroundPositionY - this.currentGroundPositionY;
    if (Math.abs(groundPositionDiff) > 0.000001) {
      clearDebugText();
      addDebugText('UPDATE GROUND0 ' + delta + ' ' + this.targetGroundPositionY + ' ' + this.currentGroundPositionY);
      if (groundPositionDiff < 0) {
        this.currentGroundPositionY -= delta * variables.BLOCKH * variables.GROUND_SPEED;
        this.currentGroundPositionY = Math.max(this.currentGroundPositionY, this.targetGroundPositionY);
        addDebugText('UPDATE GROUND ' + "NEG");
      }
      else if (groundPositionDiff > 0) {
        this.currentGroundPositionY += delta * variables.BLOCKH * variables.GROUND_SPEED;
        this.currentGroundPositionY = Math.min(this.currentGroundPositionY, this.targetGroundPositionY);
        addDebugText('UPDATE GROUND ' + "POS");
      }
      addDebugText('UPDATE GROUND ' + this.targetGroundPositionY + ' ' + this.currentGroundPositionY);
      ground.setPosition(0, this.currentGroundPositionY);

      if(this.playerDead.gameObject.y < ground.y){
        this.playerDead.gameObject.y = ground.y;
      }
      if(this.playerAlive.gameObject.y > ground.y) {
        this.playerAlive.gameObject.y = ground.y;
      }
    }
    else {

    }

    // LEFT-RIGHT
    this.controlledPlayer.gameObject.setVelocityX(inputData.deltaX * variables.PLAYER_XVELOCITY);

    // JUMP
    let mult = 1;
    if (this.controlledPlayer.gameObject.body.gravity.y < 0) {
      mult = -1;
    }
    const isTouchingFloor = (
      (mult > 0 && this.controlledPlayer.gameObject.body.touching.down)
      || (mult < 0 && this.controlledPlayer.gameObject.body.touching.up)
    );
    if (inputData.jumpDown && isTouchingFloor) {
      this.controlledPlayer.gameObject.setVelocityY(mult * -variables.JUMP_VELOCITY);
    }

    // SWITCH
    if (inputData.switchPressed) {
      console.log('SWITCH PRESSED');
      if (this.controlledPlayer === this.playerAlive) {
        this.controlledPlayer.gameObject.setVelocityX(0);
        this.controlledPlayer = this.playerDead;
      }
      else /* if (this.controlledPlayer === this.playerDead) */ {
        this.controlledPlayer.gameObject.setVelocityX(0);
        this.controlledPlayer = this.playerAlive;
      }
    }

    // SWITCH
    if (inputData.goLifePressed) {
      console.log('LIFE PRESSED');
      this.targetGroundPositionY += variables.BLOCKH;
    }
    else if (inputData.goDeathPressed) {
      console.log('DEATH PRESSED');
      this.targetGroundPositionY -= variables.BLOCKH;
    }
  }
    //COLLECT SWITCH
    function collectSwitch (player, bonus) {
    bonus.disableBody(true, true);
}

