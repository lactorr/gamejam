import * as Phaser from 'phaser';

import { BootScene } from './scenes/boot';
// import { MainMenuScene } from './scenes/main-menu';
// import { DungeonMapScene } from './scenes/dungeon-map';
import constants from './constants';
// import { HUDScene } from './scenes/hud';

// const game = new Phaser.Game({
//     type: Phaser.WEBGL,
//     parent: 'piss-me-off',
//     pixelArt: true,
//     physics: {
//         default: 'arcade',
//         arcade: {
//             //gravity: { y: 300 },
//             debug: true,
//         }
//     },
//     input: {
//         gamepad: true,
//     },
//     scale: {
//         mode: Phaser.Scale.ScaleModes.FIT,
//         autoCenter: Phaser.Scale.CENTER_BOTH,
//         width: constants.ROOM_W + constants.SIDEBAR_W,
//         height: constants.ROOM_H,
//         zoom: 3,
//     },
//     scene: [ BootScene /*, MainMenuScene, DungeonMapScene, HUDScene*/ ],
// });


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var player2;
var stars;
var ground;
var cursors;
var platform;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'src/assets/images/sky.png');
    this.load.image('ground', 'src/assets/images/platform.png');
    this.load.image('star', 'src/assets/images/star.png');
    this.load.spritesheet('dude', 'src/assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //this.physics.world.gravity.y = 299;
    //this.add.image(400, 300, 'sky');

    ground = this.physics.add.staticImage(400, 300, 'ground').setSize(800, 4).setDisplaySize(800, 4);
    //ground.width = 800;
    //ground.refreshBody();

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

    /*player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player2.setCollideWorldBounds(true);*/

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

    stars = this.physics.add.group({
        key: 'star',
        frameQuantity: 3,
        maxSize: 3,
        active: false,
        visible: true,
        enable: false,
        collideWorldBounds: true,
        bounceX: 0.5,
        bounceY: 0.5,
        dragX: 300,
        dragY: 0
    });

    this.physics.add.collider(
        player,
        platform,
        function (_player, _platform)
        {
            if (_player.body.touching.up && _platform.body.touching.down)
            {
                createStar(
                    _player.body.center.x,
                    _platform.body.top - 16,
                    _player.body.velocity.x,
                    _player.body.velocity.y * -3
                );
            }
        });

    this.physics.add.collider([player, player2], ground);
    this.physics.add.collider(player, player2);
    //this.physics.add.collider(player2, ground);
    this.physics.add.collider(stars, ground);
    this.physics.add.collider(stars, platform);
    this.physics.add.collider(stars, player);

    //this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-180);

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
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-300);
    }

    /*if (player.body.touching.down)
    {
        player.setVelocityY(-360);
    }*/
}

function collectStar (player, star)
{
    star.disableBody(true, true);
}

function createStar(x, y, vx, vy)
{
    var star = stars.get();

    if (!star) return;

    star
        .enableBody(true, x, y, true, true)
        .setVelocity(vx, vy);
}
