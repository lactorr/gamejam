import { InputData } from './inputManager';
import constants from '../constants';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export class Player {
    public gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    public currentDirection: number = 1;
    private readonly isAlive: boolean;
    private readonly animType: string;
    private rotationTarget: number = 0;
    private rotation: number = 0;

    constructor(gameScene: Phaser.Scene, isAlive: boolean) {
        const x = 40;
        const y = isAlive ? -10 : 10;

        this.isAlive = isAlive;
        this.animType = this.isAlive ? 'alive' : 'dead';

        this.gameObject = (
          gameScene.physics.add.sprite(x, y, isAlive ? 'catalive' : 'catdead')
            .setGravity(0, (isAlive ? 1 : -1) * constants.PLAYER_GRAVITY)
            .setMass(100)
            .setBodySize(200, 157, false)
            .setDisplaySize(250 * 0.25, 157 * 0.25)
        );
        this.gameObject.body.x = x + 200;
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
            this.gameObject.setRotation(0);
            if (this.currentDirection === -1) {
                this.gameObject.anims.play(`sit-${this.animType}-left`, true);
            }
            else {
                this.gameObject.anims.play(`sit-${this.animType}-right`, true);
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
              let velocityY = this.gameObject.body.velocity.y;
                this.rotationTarget = clamp((constants.JUMP_ANGLE_OFFSET-(velocityY/constants.JUMP_VELOCITY)), -constants.JUMP_ANGLE_MAX, constants.JUMP_ANGLE_MAX);
                this.rotation += ( this.rotationTarget - this.rotation) / ((Math.abs(velocityY)>1)?2:constants.JUMP_ANGLE_STEPS);

                if (this.currentDirection === -1) {
                    if(Math.abs(velocityY)>0)
                      this.gameObject.setRotation(this.rotation);
                    this.gameObject.anims.play(`jump-${this.animType}-left`, true);
                }
                else {
                  if(Math.abs(velocityY)>0)
                    this.gameObject.setRotation(-this.rotation);
                  this.gameObject.anims.play(`jump-${this.animType}-right`, true);
                }
            }
            else
            {
              this.gameObject.setRotation(0);
            }
        }
    }
}
