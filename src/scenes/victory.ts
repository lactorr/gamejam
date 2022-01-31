import constants from '../constants';
import winScreen from '../assets/images/winscreen.png';

export class Victory extends Phaser.Scene {
    constructor () {
        super('Victory');
    }

    preload() {
        this.load.image('winScreen', winScreen);
    }

    create() {
        console.log('on est dans la scene de victoire');
        this.add.image(0, constants.GAME_HEIGHT, 'winScreen').setOrigin(0, 1);

        const keyEnter = this.input.keyboard.addKey('enter');
        keyEnter.on('up', function() {
            this.scene.launch('About');
            this.scene.sleep('Victory');
        }, this);
    }

    update(time, delta) {
    }
}
