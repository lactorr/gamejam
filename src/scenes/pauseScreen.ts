import constants from '../constants';
import pauseScreen from '../assets/images/pauseScreen.png';
import { InputManager } from '../classes/inputManager';
import { GameScene } from './gameScene';

export class PauseScreen extends Phaser.Scene {
    private debugPadText: Phaser.GameObjects.Text;
    private isDebugVisible: boolean;

    constructor () {
        super('PauseScreen');
    }

    preload() {
        this.load.image('pauseScreen', pauseScreen);
    }

    create() {
        console.log('on est dans la scene de pause');
        // const sidebar_placeholder = this.add.rectangle(
        //     constants.ROOM_W + constants.SIDEBAR_W/2, constants.ROOM_H/2,
        //     constants.SIDEBAR_W, constants.ROOM_H, 0x111111);

        this.add.image(0, constants.GAME_HEIGHT, 'pauseScreen').setOrigin(0, 1);
        
        var keyEnter = this.input.keyboard.addKey('enter');
        keyEnter.on('up', function() {
          // this.scene.pause();
        this.scene.resume('GameScene');
        this.scene.launch('HUDScene');
        this.scene.sleep('PauseScreen');
        console.log('on enlève la pause');
        }, this);

    }

    update(time, delta) {
        const gameScene: any = this.game.scene.getScene('GameScene');
    }
}