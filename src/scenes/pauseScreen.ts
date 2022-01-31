import constants from '../constants';
import pauseScreen from '../assets/images/pausescreen.png';
import { GameScene } from './gameScene';

export class PauseScreen extends Phaser.Scene {
    constructor () {
        super('PauseScreen');
    }

    preload() {
        this.load.image('pauseScreen', pauseScreen);
    }

    create() {
        console.log('on est dans la scene de pause');
        const gameScene = this.game.scene.getScene('GameScene') as GameScene;

        this.add.image(0, constants.GAME_HEIGHT, 'pauseScreen').setOrigin(0, 1);

        let keyEnter = this.input.keyboard.addKey('enter');
        keyEnter.on('up', function() {
            this.scene.resume('GameScene');
            this.scene.sleep('PauseScreen');
            gameScene.gamePaused = false;
            console.log('on enlève la pause');
        }, this);

        let keyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        keyObj.on('up', function() {
            this.scene.resume('GameScene');
            this.scene.sleep('PauseScreen');
            gameScene.resetToCheckpoint();
            gameScene.gamePaused = false;
        }, this);

    }

    update(time, delta) {
        const gameScene: any = this.game.scene.getScene('GameScene');
    }
}
