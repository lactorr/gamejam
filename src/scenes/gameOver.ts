import constants from '../constants';
import gameoverScreen from '../assets/images/gameoverscreen.png';
import { InputManager } from '../classes/inputManager';
import { GameScene } from './gameScene';

export class GameOver extends Phaser.Scene {
    private debugPadText: Phaser.GameObjects.Text;
    private isDebugVisible: boolean;

    constructor () {
        super('GameOver');
    }

    preload() {
        this.load.image('gameoverScreen', gameoverScreen);
    }

    create() {
        console.log('on est dans la scene de gameover');
        // const sidebar_placeholder = this.add.rectangle(
        //     constants.ROOM_W + constants.SIDEBAR_W/2, constants.ROOM_H/2,
        //     constants.SIDEBAR_W, constants.ROOM_H, 0x111111);

        this.add.image(0, constants.GAME_HEIGHT, 'gameoverScreen').setOrigin(0, 1);
        
        var keybackSpace = this.input.keyboard.addKey('backspace');
        keybackSpace.on('up', function() {
          // this.scene.pause();
        this.scene.launch('GameScene');
        this.scene.launch('HUDScene');
        this.scene.sleep('GameOver');
        console.log('on restart le level');
        }, this);

    }

    update(time, delta) {
        const gameScene: any = this.game.scene.getScene('GameScene');
    }
}