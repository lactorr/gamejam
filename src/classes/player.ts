import { InputData } from './inputManager';
import constants from '../constants';

export class Player {
    public gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    public currentDirection: number = 1;
    private readonly isAlive: boolean;
    private readonly animType: string;

    constructor(gameScene: Phaser.Scene, isAlive: boolean) {
        const x = 40;
        const y = isAlive ? -10 : 10;

        this.isAlive = isAlive;
        this.animType = this.isAlive ? 'alive' : 'dead';

        this.gameObject = (
          gameScene.physics.add.sprite(x, y, isAlive ? 'catalive' : 'catdead')
            .setGravity(0, (isAlive ? 1 : -1) * constants.PLAYER_GRAVITY)
            .setMass(100)
            .setDisplaySize(250 * 0.2, 157 * 0.2)
            .setSize(250, 157)
        );
        this.gameObject.body.debugBodyColor = 0x00ff0000;
        this.gameObject.setCollideWorldBounds(true);
        if (isAlive) {
            this.gameObject.setOrigin(0.5, 1);
        }
        else {
            this.gameObject.setOrigin(0.5, 0);
        }
    }

    updateAnimation(isControlled: boolean, inputData: InputData, isTouchingFloor: boolean) {
        if (!isControlled) {
            if (this.currentDirection === -1) {
                this.gameObject.anims.play(`idle-${this.animType}-left`, true);
            }
            else {
                this.gameObject.anims.play(`idle-${this.animType}-right`, true);
            }
        }
        else {
            if (inputData.deltaX < 0 && isTouchingFloor) {
                this.gameObject.anims.play(`left-${this.animType}`, true);
            }
            else if (inputData.deltaX > 0 && isTouchingFloor) {
                this.gameObject.anims.play(`right-${this.animType}`, true);
            }
            else if (this.currentDirection === -1) {
                this.gameObject.anims.play(`idle-${this.animType}-left`, true);
            }
            else {
                this.gameObject.anims.play(`idle-${this.animType}-right`, true);
            }

            if (!isTouchingFloor) {
                if (this.currentDirection === -1) {
                    this.gameObject.anims.play(`jump-${this.animType}-left`, true);
                }
                else {
                    this.gameObject.anims.play(`jump-${this.animType}-right`, true);
                }
            }
        }
    }
}
