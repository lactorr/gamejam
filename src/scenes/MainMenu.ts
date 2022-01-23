export class MainMenuScene extends Phaser.Scene {


    constructor () {
        super('MainMenuScene');
    }

    preload() {

    }

    create() {

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
