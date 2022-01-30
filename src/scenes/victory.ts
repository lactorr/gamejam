import constants from '../constants';
import winScreen from '../assets/images/winscreen.png';
import { InputManager } from '../classes/inputManager';
import { GameScene } from './gameScene';

export class Victory extends Phaser.Scene {
    private debugPadText: Phaser.GameObjects.Text;
    private isDebugVisible: boolean;

    constructor () {
        super('Victory');
    }

    preload() {
        this.load.image('winScreen', winScreen);
    }

    create() {
        console.log('on est dans la scene de victoire');
        // const sidebar_placeholder = this.add.rectangle(
        //     constants.ROOM_W + constants.SIDEBAR_W/2, constants.ROOM_H/2,
        //     constants.SIDEBAR_W, constants.ROOM_H, 0x111111);

        this.add.image(0, constants.GAME_HEIGHT, 'winScreen').setOrigin(0, 1);
        
        var keyEnter = this.input.keyboard.addKey('enter');
        keyEnter.on('enter', function() {
          // this.scene.pause();
        this.scene.launch('About');
        this.scene.sleep('Victory');
        console.log('on restart le level');
        }, this);

    }

    update(time, delta) {
        const gameScene: any = this.game.scene.getScene('GameScene');
    }
}