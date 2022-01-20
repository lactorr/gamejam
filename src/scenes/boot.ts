//const animatedTiles = require('phaser-animated-tiles');
import * as Phaser from "phaser";
// @ts-ignore
import preloaderBar from '../assets/images/preloader-bar.png';
// @ts-ignore
// import tilesMap from  '../assets/images/tiles.png';
// @ts-ignore
import dungeonTilesMap from  '../assets/images/dungeon_tiles_0_retouche.png';
// @ts-ignore
import level1 from  '../assets/levels/level1.json';

export class BootScene extends Phaser.Scene {
    constructor () {
        super('Boot');
    }

    preload() {
        this.load.on('progress', (value) => {
            console.log(value);
            if (value === 1) {
                this.scene.launch('DungeonMap').launch('HUD').stop();
            }
        });

        let guides = this.add.graphics();
        guides.fillStyle(0x00ff00, 1);
        guides.fillRect(0, 360, 1280, 1);
        guides.fillRect(640, 0, 1, 1280);

        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(100, 340, 1080, 40);

        //assets we'll use in the loading screen
        this.load.image('preloadbar', preloaderBar);
        //this.load.image('brownDoor', brownDoor);
        //this.load.spritesheet('tiles', tilesMap, { frameWidth: 16, frameHeight: 16 });

        this.load.image('dungeonTiles', dungeonTilesMap);
        this.load.tilemapTiledJSON('level1', level1);
    }

    create() {
    }
}
