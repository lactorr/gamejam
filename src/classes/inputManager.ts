/*
  Everything that's about input managing
*/

import { GameScene } from '../scenes/gameScene';

export type InputData = {
    deltaX: number, deltaY: number,
    jumpDown: boolean,
    switchDown: boolean,
    switchPressed: boolean,
    debugDown: boolean,
};

export class InputManager {
    private keyboardCursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyboardSwitchKey: Phaser.Input.Keyboard.Key;
    private previousInputData: InputData = {
        deltaX: 0,
        deltaY: 0,
        jumpDown: false,
        switchDown: false,
        switchPressed: false,
        debugDown: false,
    };

    constructor(gameScene: Phaser.Scene) {
        this.keyboardCursors = gameScene.input.keyboard.createCursorKeys();
        this.keyboardSwitchKey = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    }

    handleInputs(): InputData {
        const out: InputData = {
            deltaX: 0,
            deltaY: 0,
            jumpDown: false,
            switchDown: false,
            switchPressed: false,
            debugDown: false,
        };

        if (this.keyboardCursors.left.isDown) {
            out.deltaX = -180;
            /*player.setVelocityX(-180);

            player.anims.play('left', true);*/
        }
        else if (this.keyboardCursors.right.isDown) {
            out.deltaX = +180;
            /*player.setVelocityX(180);

            player.anims.play('right', true);*/
        }
        // else
        // {
        //     /*player.setVelocityX(0);
        //
        //     player.anims.play('turn');*/
        // }

        if (this.keyboardCursors.up.isDown /*&& player.body.touching.down*/) {
            //player.setVelocityY(-300);
            out.jumpDown = true;
        }

        if (this.keyboardSwitchKey.isDown) {
            out.switchDown = true;
        }
        if (this.keyboardSwitchKey.isUp && this.previousInputData.switchDown) {
            out.switchPressed = true;
        }

        // if (!!this.pad) {
        //     // Joystick axes
        //     let deltaX = this.pad.axes[0].getValue();
        //     let deltaY = this.pad.axes[1].getValue();
        //     if (Math.abs(deltaX) < 0.2) {
        //         deltaX = 0;
        //     }
        //     if (Math.abs(deltaY) < 0.2) {
        //         deltaY = 0;
        //     }
        //
        //     // TODO control mapping
        //     const debugDown = this.pad.buttons[8].pressed;
        //     const actionDown = this.pad.buttons[2].pressed;
        //     this.inputData = {
        //         deltaX, deltaY,
        //         actionDown,
        //         debugDown,
        //     };
        //     if (!this.lastInputData.debugDown && debugDown) {
        //         inputsEventsCenter.emit('debugPressed');
        //     }
        //     if (!this.lastInputData.actionDown && actionDown) {
        //         console.log('actionPressed');
        //         inputsEventsCenter.emit('actionPressed');
        //     }
        // }

        this.previousInputData = out;

        return out;
    }
}
