import {Level} from './level';
import Constants from '../constants';

export class LevelLoader {
  public level: Level = {};
  private file: string;
  private scene: Phaser.Scene;

  constructor( scene:Phaser.Scene ) {
    this.scene = scene;
    this.level.blockGroup = this.scene.physics.add.group({
      immovable : true,
      defaultKey : 'blockNtrAlive',
    }).setOrigin(0, 0);
    this.level.switchAliveGroup = this.scene.physics.add.group({
      immovable : true,
      defaultKey : 'switchAlive',
    }).setOrigin(0, 0);
    this.level.switchDeadGroup= this.scene.physics.add.group({
      immovable : true,
      defaultKey : 'switchDead',
    }).setOrigin(0, 0);
  }

  parse(json, mask):Level {
    console.log(json);
    this.level.elements = [];
    var blocks = json.blocks;
    for( var i in blocks){
      for( var j in blocks[i])
      {
        var block = blocks[i][j];
        switch(block){
          case "#":
            this.level.elements.push({x: Number(j) , y: Number(i) - 5, w:1, h:1, type: "blockNtrAlive"});
          break
          case "+":
            this.level.elements.push({x: Number(j) , y: Number(i) - 5, w:1, h:1, type: "switchAlive"});
          break
          case "-":
            this.level.elements.push({x: Number(j) , y: Number(i) - 5, w:1, h:1, type: "switchDead"});
          break
          default:

          break
        }
      }
    }
    this.level.levelWidth = Number(j) * Constants.BLOCKW;
    console.log(this.level.elements)
    this.level.elements.map((element) => {
      var ex = element.x * Constants.BLOCKW ;
      var ey =  element.y * Constants.BLOCKH ;

      switch (element.type) {
      case "blockNtrAlive":
        const block = this.level.blockGroup.create(ex, ey, element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.BLOCKW, element.h * Constants.BLOCKH)
          .setMask(mask);

        block.body.debugShowBody = false;
        break;
      case "blockNtrDead":
        this.level.blockGroup.create(ex, ey, element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.BLOCKW, element.h * Constants.BLOCKH)
          .setMask(mask);
        break;
      case "switchAlive":
        this.level.switchAliveGroup
          .create(ex + (Constants.BLOCKW - Constants.SWITCH_SIZE) * 0.5,
                  ey + (Constants.BLOCKH - Constants.SWITCH_SIZE) * 0.5,
                  element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.SWITCH_SIZE, element.h * Constants.SWITCH_SIZE)
          .setMask(mask);
        break;
      case "switchDead":
        this.level.switchDeadGroup
          .create(ex + (Constants.BLOCKW - Constants.SWITCH_SIZE) * 0.5,
                  ey + (Constants.BLOCKH - Constants.SWITCH_SIZE) * 0.5,
                  element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.SWITCH_SIZE, element.h * Constants.SWITCH_SIZE)
          .setMask(mask);
        break;
      default:
        console.log("Type doesn't exists");
        break;
      }
    });
    return this.level;

  }
}
 // this.level = Level();
