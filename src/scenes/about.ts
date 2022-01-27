import constants from '../constants';
import aboutScreen from '../assets/images/aboutscreen.png';
import { InputManager } from '../classes/inputManager';
import { GameScene } from './gameScene';

export class About extends Phaser.Scene {
    private debugPadText: Phaser.GameObjects.Text;
    private isDebugVisible: boolean;

    constructor () {
        super('About');
    }

    preload() {
        this.load.image('aboutScreen', aboutScreen);
    }

    create() {
        console.log('on est dans la scene de about');
        // const sidebar_placeholder = this.add.rectangle(
        //     constants.ROOM_W + constants.SIDEBAR_W/2, constants.ROOM_H/2,
        //     constants.SIDEBAR_W, constants.ROOM_H, 0x111111);

        this.add.image(0, constants.GAME_HEIGHT, 'aboutScreen').setOrigin(0, 1);
        
        var keyEnter = this.input.keyboard.addKey('backspace');
        keyEnter.on('up', function() {
          // this.scene.pause();
        this.scene.launch('GameScene');
        this.scene.launch('HUDScene');
        this.scene.sleep('About');
        console.log('on restart le level');
        }, this);

    }

    update(time, delta) {
        const gameScene: any = this.game.scene.getScene('GameScene');
    }
}