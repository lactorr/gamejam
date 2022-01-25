import constants from '../constants';
import assetCartonAliveBas from '../assets/images/cartonalivebas.png';
import assetCartonAliveHaut from '../assets/images/cartonalivehaut.png';
import assetCartonDeadBas from '../assets/images/cartondeadbas.png';
import pauseScreen from '../assets/images/pauseScreen.png';
import assetKeys from '../assets/images/touches.png';
import { InputManager } from '../classes/inputManager';
import { GameScene } from './gameScene';

export class PauseScreen extends Phaser.Scene {
    private debugPadText: Phaser.GameObjects.Text;
    private isDebugVisible: boolean;
    private cartonAliveBas: Phaser.GameObjects.Image;
    private cartonAliveHaut: Phaser.GameObjects.Image;
    private cartonDeadBas: Phaser.GameObjects.Image;
    private cartonDeadHaut: Phaser.GameObjects.Image;

    constructor () {
        super('PauseScreen');
    }

    preload() {
        this.load.image('pauseScreen', pauseScreen);
        this.load.image('cartonAliveHaut', assetCartonAliveHaut);
        this.load.image('cartonDeadBas', assetCartonDeadBas);
        this.load.image('keys', assetKeys);
    }

    create() {
        console.log('on est dans la scene de pause');
        // const sidebar_placeholder = this.add.rectangle(
        //     constants.ROOM_W + constants.SIDEBAR_W/2, constants.ROOM_H/2,
        //     constants.SIDEBAR_W, constants.ROOM_H, 0x111111);

        this.add.image(0, constants.GAME_HEIGHT, 'pauseScreen').setOrigin(0, 1);
        this.cartonAliveHaut  = this.add.image(0, -30, 'cartonAliveHaut').setOrigin(0, 0);
        this.cartonDeadBas  = this.add.image(0, constants.GAME_HEIGHT, 'cartonDeadBas').setOrigin(0, 1).setVisible(false);
        this.add.image(0, constants.GAME_HEIGHT, 'keys').setOrigin(0, 1);
        
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