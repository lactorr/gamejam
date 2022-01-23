import { InputManager } from '../classes/inputManager';
import { Player } from '../classes/player';

let ground;
let cursors;
let platform;
let box1;
let box1d;
let loopMetal;
let loopSynth;

// noinspection JSUnusedGlobalSymbols
export class GameScene extends Phaser.Scene {
    private inputManager: InputManager;
    private playerAlive: Player;
    private playerDead: Player;
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
        this.load.image('boxfixe01', 'src/assets/images/boxfixe01.png');
        this.load.image('boxfixe01d', 'src/assets/images/boxfixe01d.png');
        this.load.audio('loopSynth', ['src/assets/sounds/music_loop_synth.mp3']);
        this.load.audio('loopMetal', ['src/assets/sounds/music_loop_metal.mp3']);
    }

    create() {
        console.log(this.physics.world);

        ground = this.physics.add.staticImage(400, 300, 'ground').setSize(800, 4).setDisplaySize(800, 4);
        platform = this.physics.add.image(400, 400, 'ground').setScale(0.5).refreshBody();

        box1 = this.physics.add.image(400, 200, 'boxfixe01').setDisplaySize(328*0.3, 265*0.3);
        box1d = this.physics.add.image(400, 400, 'boxfixe01d').setDisplaySize(328*0.3, 265*0.3);

        loopSynth = this.sound.add('loopSynth', { loop: true });
        loopMetal = this.sound.add('loopMetal', {loop: true});
        loopSynth.play(); //defaultMusic

        box1.setImmovable(true);
        box1d.setImmovable(true);

        platform.setImmovable(true);
        platform.body.allowGravity = false;

        this.playerAlive = new Player(this.physics.add.sprite(100, 150, 'catalive').setGravity(0, 300).setDisplaySize(109, 57));
        this.playerDead = new Player(this.physics.add.sprite(100, 550, 'catdead').setGravity(0, -300).setDisplaySize(109, 57));
        this.controlledPlayer = this.playerAlive;

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

        this.physics.add.collider([this.playerAlive.gameObject, this.playerDead.gameObject], [box1, box1d]);
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
                loopSynth.stop();
                loopMetal.play();
            }
            else /* if (this.controlledPlayer === this.playerDead) */ {
                this.controlledPlayer = this.playerAlive;
                loopMetal.stop();
                loopSynth.play();
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
