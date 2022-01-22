/**

*/
export class Player {
    public gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        this.gameObject = gameObject;
        this.gameObject.setCollideWorldBounds(true);
    }
}
