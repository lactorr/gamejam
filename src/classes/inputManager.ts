/*
  Everything that's about input managing
*/

import { GameScene } from '../scenes/gameScene';

export type InputData = {
    deltaX: number, deltaY: number,
    jumpDown: boolean,
    switchDown: boolean,
    switchPressed: boolean,
    goLifeDown: boolean,
    goLifePressed: boolean,
    goDeathDown: boolean,
    goDeathPressed: boolean,
    debugDown: boolean,
};

export class InputManager {
    private keyboardCursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyboardSwitchKey: Phaser.Input.Keyboard.Key;
    private keyboardLifeKey: Phaser.Input.Keyboard.Key;
    private keyboardDeathKey: Phaser.Input.Keyboard.Key;
    private previousInputData: InputData = {
        deltaX: 0,
        deltaY: 0,
        jumpDown: false,
        switchDown: false,
        switchPressed: false,
        goLifeDown: false,
        goLifePressed: false,
        goDeathDown: false,
        goDeathPressed: false,
        debugDown: false,
    };

    constructor(gameScene: Phaser.Scene) {
        this.keyboardCursors = gameScene.input.keyboard.createCursorKeys();
        this.keyboardSwitchKey = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.keyboardLifeKey = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD);
        this.keyboardDeathKey = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT);
    }

    handleInputs(): InputData {
        const out: InputData = {
            deltaX: 0,
            deltaY: 0,
            jumpDown: false,
            switchDown: false,
            switchPressed: false,
            goLifeDown: false,
            goLifePressed: false,
            goDeathDown: false,
            goDeathPressed: false,
            debugDown: false,
        };

        if (this.keyboardCursors.left.isDown) {
            out.deltaX = -1;
            /*player.setVelocityX(-180);

            player.anims.play('left', true);*/
        }
        else if (this.keyboardCursors.right.isDown) {
            out.deltaX = +1;
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

        if (this.keyboardLifeKey.isDown) {
            out.goLifeDown = true;
        }
        if (this.keyboardLifeKey.isUp && this.previousInputData.goLifeDown) {
            out.goLifePressed = true;
        }

        if (this.keyboardDeathKey.isDown) {
            out.goDeathDown = true;
        }
        if (this.keyboardDeathKey.isUp && this.previousInputData.goDeathDown) {
            out.goDeathPressed = true;
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
