//setting game configuration and loading the assets for the loading screen
import constants from '../constants';
import assetKeys from '../assets/images/touches.png';
//import { inputsEventsCenter } from './dungeon-map';

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

    constructor () {
        super('HUD');
    }

    preload() {
        this.load.image('keys', assetKeys);
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

        //this.add.image(0, constants.GAME_HEIGHT, 'keys').setOrigin(0, 1);
        //this.add.image(0, -30, 'cartonDeadBas').setOrigin(0, 0);
        //this.add.image(0, -300, 'cartonAliveBas');
        //this.add.image(0, 0, 'cartonAliveBas');
        //this.add.image(0, 0, 'cartonAliveBas');

        /*inputsEventsCenter.on('debugPressed', () => {
            this.isDebugVisible = !this.isDebugVisible;
            this.debugPadText.setVisible(this.isDebugVisible);
        });*/
    }

    update(time, delta) {
        const gameScene: any = this.game.scene.getScene('GameScene');

        let debug = [];

        const fps = Math.round(1000/delta * 100)/100;
        debug.push('FPS:' + fps);
        debug.push('debug:\n' + debugText);
        this.debugPadText.setText(debug);
    }
}
