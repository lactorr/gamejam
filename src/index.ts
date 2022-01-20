import * as Phaser from 'phaser';

import { BootScene } from './scenes/boot';
// import { MainMenuScene } from './scenes/main-menu';
// import { DungeonMapScene } from './scenes/dungeon-map';
import constants from './constants';
// import { HUDScene } from './scenes/hud';

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent: 'piss-me-off',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 300 },
            debug: true,
        }
    },
    input: {
        gamepad: true,
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: constants.ROOM_W + constants.SIDEBAR_W,
        height: constants.ROOM_H,
        zoom: 3,
    },
    scene: [ BootScene /*, MainMenuScene, DungeonMapScene, HUDScene*/ ],
});
