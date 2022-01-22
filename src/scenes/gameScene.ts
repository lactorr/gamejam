import { InputManager } from '../classes/inputManager';
import { Player } from '../classes/player';
import { Level } from '../classes/level';

var ground;
var cursors;
var platform;
var box1;
var box1d;
var t = 0;
var variables = {
  BLOCKW: 60,
  BLOCKH: 50,
  JUMP_VELOCITY: 550,
  PLAYER_GRAVITY: 2000,
  PLAYER_XVELOCITY: 200,
};

// noinspection JSUnusedGlobalSymbols
export class GameScene extends Phaser.Scene {
  private inputManager: InputManager;
  private playerAlive: Player;
  private playerDead: Player;
  private level: Level;
  private controlledPlayer: Player;

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
  }

  create() {
    var levelBlocks = this.physics.add.group({
      immovable: true,
      defaultKey: 'blockNtrAlive',
    });
    //this.level = Level();
    this.level = { elements:[
      { x:2, y:5, w:1, h:1, type: "blockNtrAlive" },
      { x:2, y:6, w:1, h:1, type: "blockNtrAlive" },
      { x:2, y:7, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:4, w:1, h:1, type: "blockNtrAlive" },
      { x:7, y:3, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:5, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:6, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:7, w:1, h:1, type: "blockNtrAlive" },
      { x:3, y:3, w:1, h:1, type: "switchAlive" },
      { x:3, y:8, w:1, h:1, type: "switchDead" },
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
        break;
        default:
        console.log("Type doesn't exists");
        break;
      }

    });

    ground = this.physics.add.image(400, 300, 'ground').setOrigin(0,0).setSize(800, 20).setDisplaySize(800, 4);
    ground.setImmovable(true);
    //box1 = this.physics.add.image(400, 200, 'boxfixe01').setDisplaySize(328*0.3, 265*0.3);
    //box1d = this.physics.add.image(400, 400, 'boxfixe01d').setDisplaySize(328*0.3, 265*0.3);

    //box1.setImmovable(true);
    //box1d.setImmovable(true);

    this.playerAlive = new Player(this.physics.add.sprite(100, 200, 'catalive').setGravity(0, variables.PLAYER_GRAVITY).setMass(10000).setSize(329, 172).setDisplaySize(109*0.6, 57*0.6));
    this.playerAlive.gameObject.setOrigin(0.5,1);
    this.playerDead = new Player(this.physics.add.sprite(100, 400, 'catdead').setGravity(0, -variables.PLAYER_GRAVITY).setMass(100).setSize(329, 172).setDisplaySize(109*0.6, 57*0.6));
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
}

update (delta) {
  const inputData = this.inputManager.handleInputs();
  //ground.setPosition(0,Math.sin(delta/1000)*100+300);

  if(this.playerDead.gameObject.y<ground.y)
  this.playerDead.gameObject.y = ground.y;
  if(this.playerAlive.gameObject.y>ground.y)
  this.playerAlive.gameObject.y = ground.y;

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
      this.controlledPlayer = this.playerDead;
    }
    else /* if (this.controlledPlayer === this.playerDead) */ {
      this.controlledPlayer = this.playerAlive;
    }
  }

  /*else {
  player.setVelocityY(-300);
}*/
/*if (inputData.deltaX)
{

player.anims.play('left', true);
}
else if (cursors.right.isDown)
{
player.setVelocityX(180);

player.anims.play('right', true);
}
else
{
player.setVelocityX(0);

player.anims.play('turn');
}*/

// if (cursors.up.isDown && player.body.touching.down)
// {
//     player.setVelocityY(-300);
// }
}
}
