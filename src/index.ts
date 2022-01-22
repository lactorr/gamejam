import * as Phaser from 'phaser';
import { BootScene } from './scenes/boot';
// import { MainMenuScene } from './scenes/main-menu';
// import { DungeonMapScene } from './scenes/dungeon-map';
import constants from './constants';

import { Game } from "./classes/game";

var game = new Game();
var stars;

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
