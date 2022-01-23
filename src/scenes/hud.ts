//setting game configuration and loading the assets for the loading screen
import constants from '../constants';
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

    }

    create() {
        // const sidebar_placeholder = this.add.rectangle(
        //     constants.ROOM_W + constants.SIDEBAR_W/2, constants.ROOM_H/2,
        //     constants.SIDEBAR_W, constants.ROOM_H, 0x111111);

        this.debugPadText = this.add.text(10, 30, '', { font: '10px Courier', color: '#ffffff' });
        this.debugPadText.setText('waiting for gamepad');
        this.debugPadText.setDepth(constants.Z_HUD_DEBUG);
        this.isDebugVisible = true;
        this.debugPadText.setVisible(this.isDebugVisible);
        this.physics.config.debug = true;

        /*inputsEventsCenter.on('debugPressed', () => {
            this.isDebugVisible = !this.isDebugVisible;
            this.debugPadText.setVisible(this.isDebugVisible);
        });*/
    }

    update(time, delta) {
        this.debugPad(delta);
    }

    debugPad(delta) {
        let debug = [];

        //let pads = this.input.gamepad.gamepads;
        // let pads = this.input.gamepad.getAll();
        // let pads = navigator.getGamepads();

        // for (let i = 0; i < pads.length; i++)
        // {
        //     let pad = pads[i];
        //
        //     if (!pad) {
        //         continue;
        //     }
        //
        //     //  Timestamp, index. ID
        //     //debug.push(pad.id);
        //     debug.push('Index: ' + pad.index + ' Timestamp: ' + pad.timestamp);
        //
        //     //  Buttons
        //
        //     let buttons = '';
        //
        //     for (let b = 0; b < pad.buttons.length; b++)
        //     {
        //         let button = pad.buttons[b];
        //
        //         buttons = buttons.concat('B' + button.index + ': ' + button.value + '  ');
        //         // buttons = buttons.concat('B' + b + ': ' + button.value + '  ');
        //
        //         if (b === 8)
        //         {
        //             debug.push(buttons);
        //             buttons = '';
        //         }
        //     }
        //
        //     debug.push(buttons);
        //
        //     //  Axis
        //
        //     let axes = '';
        //
        //     for (let a = 0; a < pad.axes.length; a++)
        //     {
        //         let axis = pad.axes[a];
        //
        //         axes = axes.concat('A' + axis.index + ': ' + Math.round(axis.getValue()*100)/100 + '  ');
        //         // axes = axes.concat('A' + a + ': ' + axis + '  ');
        //
        //         if (a === 1)
        //         {
        //             debug.push(axes);
        //             axes = '';
        //         }
        //     }
        //
        //     const fps = Math.round(1000/delta * 100)/100;
        //
        //     debug.push(axes);
        //     debug.push('');
        //     debug.push('PX: ' + px + '; PY: ' + py);
        //     debug.push('RX: ' + rx + '; RY: ' + ry);
        //     debug.push('FPS:' + fps);
        //     debug.push('PV:' + pv + '; INV_F:' + invincibilityFrames);
        // }

        const fps = Math.round(1000/delta * 100)/100;
        debug.push('FPS:' + fps);
        debug.push('debug:' + debugText);
        this.debugPadText.setText(debug);
    }
}
