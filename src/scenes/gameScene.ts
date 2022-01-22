import { InputManager } from '../classes/inputManager';
import { Player } from '../classes/player';
import { Level } from '../classes/level';

var ground;
var cursors;
var platform;

var variables = {
  BLOCKW: 30,
  BLOCKH: 30,

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
    }

    create() {
        //this.level = Level();
        this.level = { elements:[
          { x:1, y:3, w:30, h:10, type: "block" },
          { x:2, y:1, w:30, h:10, type: "blockd" },
          { x:3, y:2, w:30, h:10, type: "block" },
          { x:4, y:1, w:30, h:10, type: "blockd" },
        ]};

        this.level.elements.map(function(element){
          var ex = element.x * variables.BLOCKW;
          var ey = element.y * variables.BLOCKH;

          switch(element.type){
            case "block":
              this.physics.add.staticImage(400, 300, 'ground').setSize(800, 4).setDisplaySize(800, 4);
            break;
            case "blockd":
            break;
            default:
              console.log("Type doesn't exists");
            break;
          }
        });

        ground = this.physics.add.staticImage(400, 300, 'ground').setSize(800, 4).setDisplaySize(800, 4);

        this.playerAlive = new Player(this.physics.add.sprite(100, 200, 'catalive').setGravity(0, 300).setSize(329, 172).setDisplaySize(109, 57));
        this.playerDead = new Player(this.physics.add.sprite(100, 400, 'catdead').setGravity(0, -300).setSize(329, 172).setDisplaySize(109, 57));
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
    }

    update () {
        const inputData = this.inputManager.handleInputs();

        // LEFT-RIGHT
        this.controlledPlayer.gameObject.setVelocityX(inputData.deltaX);

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
            this.controlledPlayer.gameObject.setVelocityY(mult * -300);
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
