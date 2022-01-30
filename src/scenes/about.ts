import constants from '../constants';
import aboutScreen from '../assets/images/aboutscreen.png';
import { soundManager } from '../classes/soundManager';

export class About extends Phaser.Scene {
    constructor () {
        super('About');
    }

    preload() {
        this.load.image('aboutScreen', aboutScreen);
    }

    create() {
        console.log('on est dans la scene de about');
        soundManager.startRonron();

        this.add.image(0, constants.GAME_HEIGHT, 'aboutScreen').setOrigin(0, 1);

        this.input.keyboard.on('keyup', function() {
            soundManager.stopRonron();
            this.scene.launch('MainMenuScene');
            this.scene.sleep('About');
            console.log('on retourne au menu');
        }, this);
    }

    update(time, delta) {
    }
}
