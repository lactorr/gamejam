import { InputManager } from '../classes/inputManager';

var player;
var player2;
var ground;
var cursors;
var platform;

// noinspection JSUnusedGlobalSymbols
export class GameScene extends Phaser.Scene {
    private inputManager: InputManager;

    setInputManager(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    preload () {
        this.load.image('sky', 'src/assets/images/sky.png');
        this.load.image('ground', 'src/assets/images/platform.png');
        this.load.image('star', 'src/assets/images/star.png');
        this.load.spritesheet('dude', 'src/assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create () {
        ground = this.physics.add.staticImage(400, 300, 'ground').setSize(800, 4).setDisplaySize(800, 4);
        platform = this.physics.add.image(400, 400, 'ground').setScale(0.5).refreshBody();

        platform.setImmovable(true);
        platform.body.allowGravity = false;

        var group = this.physics.add.group({
            defaultKey: 'dude',
            bounceX: 0,
            bounceY: 0.2,
            collideWorldBounds: true
        });

        player = group.create(100, 150, 'dude').setGravity(0, 300);
        player2 = group.create(100, 550, 'dude').setGravity(0, -300);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(
            player,
            platform,
            function(_player, _platform)
            {
                if (_player.body.touching.up && _platform.body.touching.down)
                {
                  /*
                    DO SOMETHING
                  */
                }
            });

        this.physics.add.collider([player, player2], ground);
        this.physics.add.collider(player, player2);
    }

    update () {
        const inputData = this.inputManager.handleInputs();

        // LEFT-RIGHT
        player.setVelocityX(inputData.deltaX);

        // JUMP
        if (inputData.jumpDown && player.body.touching.down) {
            player.setVelocityY(-300);
        }

        // SWITCH
        if (inputData.switchPressed) {
            console.log('SWITCH PRESSED');
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
