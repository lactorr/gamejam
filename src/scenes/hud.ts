//setting game configuration and loading the assets for the loading screen
import constants from '../constants';
import assetCartonAliveBas from '../assets/images/cartonalivebas.png';
import assetCartonAliveHaut from '../assets/images/cartonalivehaut.png';
import assetCartonDeadBas from '../assets/images/cartondeadbas.png';
import assetCartonDeadHaut from '../assets/images/cartondeadhaut.png';
import assetKeys from '../assets/images/touches.png';
import assetBoxLine from '../assets/images/boxline.png';
import assetBoxDoorLine from '../assets/images/doorline.png';
import assetScientist from '../assets/images/scientistline.png';
import assetLine from '../assets/images/line.png';
import {GameScene} from './gameScene';

let px = 0, py = 0;
let rx = 0, ry = 0;
let pv = 0;
let invincibilityFrames = 0;

export function setPlayerRoomPos(x, y) {
    px = Math.round(x*100)/100;
    py = Math.round(y*100)/100;
}

export function setRoomPos(x, y) {
    rx = x;
    ry = y;
}

export function setLife(_pv, _invincibilityFrames) {
    pv = _pv;
    invincibilityFrames = _invincibilityFrames;
}

let debugText = '';
export function addDebugText(txt) {
    debugText += txt + "\n";
}
export function clearDebugText() {
    debugText = '';
}

export class HUDScene extends Phaser.Scene {
    private debugPadText: Phaser.GameObjects.Text;
    private isDebugVisible: boolean;
    private lineImage: Phaser.GameObjects.Image;
    private boxImage: Phaser.GameObjects.Image;
    private doorImage: Phaser.GameObjects.Image;
    private scientistImage: Phaser.GameObjects.Image;

    constructor () {
        super('HUD');
    }

    preload() {
        this.load.image('cartonAliveBas', assetCartonAliveBas);
        this.load.image('cartonAliveHaut', assetCartonAliveHaut);
        this.load.image('cartonDeadBas', assetCartonDeadBas);
        this.load.image('cartonDeadHaut', assetCartonDeadHaut);
        this.load.image('keys', assetKeys);
        this.load.image('boxline', assetBoxLine);
        this.load.image('doorline', assetBoxDoorLine);
        this.load.image('scientistline', assetScientist);
        this.load.image('line', assetLine);
    }

    create() {
        // const sidebar_placeholder = this.add.rectangle(
        //     constants.ROOM_W + constants.SIDEBAR_W/2, constants.ROOM_H/2,
        //     constants.SIDEBAR_W, constants.ROOM_H, 0x111111);

        this.debugPadText = this.add.text(10, 30, '', { font: '20px Courier', color: '#ffffff' });
        this.debugPadText.setText('waiting for gamepad');
        this.debugPadText.setDepth(constants.Z_HUD_DEBUG);
        this.isDebugVisible = true;
        this.debugPadText.setVisible(this.isDebugVisible);
        //this.physics.config.debug = true;

        /*inputsEventsCenter.on('debugPressed', () => {
            this.isDebugVisible = !this.isDebugVisible;
            this.debugPadText.setVisible(this.isDebugVisible);
        });*/

        // LIGNE DU POURSUIVANT
        const lineY = constants.GAME_HEIGHT - 80;
        this.lineImage = this.add.image(constants.GAME_WIDTH/2, lineY, 'line');
        this.boxImage = this.add.image((constants.GAME_WIDTH - this.lineImage.width), lineY, 'boxline');
        this.doorImage = this.add.image(this.lineImage.width + (constants.GAME_WIDTH - this.lineImage.width) / 2 - 20, lineY, 'doorline');
        this.scientistImage = this.add.image((constants.GAME_WIDTH - this.lineImage.width) / 2, lineY, 'scientistline');


        //tête du scientifique qui bouge
        var timeline = this.tweens.createTimeline();
        timeline.add ({
            targets: this.scientistImage,
            x: (constants.GAME_WIDTH - this.lineImage.width) / 2,
            ease: 'Linear',
            duration: constants.DELAI
        });
        timeline.add ({
            targets: this.scientistImage,
            x: this.lineImage.width,
            ease: 'Linear',
            duration: constants.TIMER
        });

        timeline.play();
    }

    update(time, delta) {
        const gameScene: any = this.game.scene.getScene('GameScene');

        let debug = [];

        const fps = Math.round(1000/delta * 100)/100;
        debug.push('FPS:' + fps);
        debug.push('debug:\n' + debugText);
        this.debugPadText.setText(debug);

        // Mouvement de la box
        const gamescene = this.game.scene.getScene('GameScene') as GameScene;
        if (gamescene.playerAlive && gamescene.playerDead) {
            const lineWidth = this.lineImage.displayWidth;
            const boxOffset = (gamescene.playerAlive.gameObject.x + gamescene.playerDead.gameObject.x)*.5;
            const completePercent = (boxOffset / Number(gamescene.level.levelWidth));
            const boxImageInitX = (constants.GAME_WIDTH - this.lineImage.width)/2;
            this.boxImage.x = Math.min(this.lineImage.width - (constants.GAME_WIDTH - this.lineImage.width)/2, boxImageInitX + lineWidth*completePercent);
        }
    }
}
