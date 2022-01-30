import {Level} from './level';
import Constants from '../constants';

export class LevelLoader {
  public level: Level = {};
  private file: string;
  private scene: Phaser.Scene;

  constructor( scene:Phaser.Scene ) {
    this.scene = scene;
    this.level.blockGroup = this.scene.add.group({
      defaultKey : 'blockNtrAlive',
    }).setOrigin(0, 0);
    this.level.checkpointGroup = this.scene.add.group({
      defaultKey : 'checkpoint',
    }).setOrigin(0, 0);
    this.level.collisionGroup = this.scene.physics.add.group({
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
    for( var y =0; y< blocks.length; y++){
      for( var x =0; x< blocks[y].length; x++)
      {
        var block = blocks[y][x];
        switch(block){
          case "#":
          // ... On est sur une boite
          var k = 0;
          if((y<=1) || (blocks[y-1][x]!="#")) // Si le bloc du dessus n'est pas une boite
          {
            while(y+k < blocks.length && (blocks[y+k][x]=="#")) // Tant que block+1 est une boite
            {
              k++;
            }
            this.level.elements.push({x: x , y: y - 5, w:1, h:k, type: "blockCollision"});
          }
          this.level.elements.push({x: x , y: y - 5, w:1, h:1, type: "blockNtrAlive"});
          break
          case "|":
            this.level.elements.push({x: x , y: -5, w:1, h:blocks.length, type: "checkpoint"})
          break
          case "+":
          this.level.elements.push({x: x , y: y - 5, w:1, h:1, type: "switchAlive"});
          break
          case "-":
          this.level.elements.push({x: x , y: y - 5, w:1, h:1, type: "switchDead"});
          break
          default:

          break
        }
      }
    }
    this.level.checkpoints = [];
    this.level.levelWidth = x * Constants.BLOCKW;
    let bonusId = 0;
    let gameSwitch;
    this.level.elements.map((element) => {
      let ex = element.x * Constants.BLOCKW ;
      let ey = element.y * Constants.BLOCKH ;
      switch (element.type) {
        case "blockCollision":
          this.level.collisionGroup.create(ex, ey, element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.BLOCKW, element.h * Constants.BLOCKH)
          .setVisible(false)
          .setMask(mask);

        break;
        case "blockNtrAlive":
          const block = this.level.blockGroup.create(ex, ey, element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.BLOCKW, element.h * Constants.BLOCKH)
          .setMask(mask);

          //block.body.debugShowBody = false;
        break;
        case "blockNtrDead":
          this.level.blockGroup.create(ex, ey, element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.BLOCKW, element.h * Constants.BLOCKH)
          .setMask(mask);
        break;
        case "checkpoint":
          this.level.checkpoints.push(ex);
          this.level.checkpointGroup.create(ex, ey, element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.BLOCKW, element.h * Constants.BLOCKH)
          .setMask(mask);
        break;
        case "switchAlive":
          gameSwitch = this.level.switchAliveGroup
          .create(ex + (Constants.BLOCKW - Constants.SWITCH_SIZE) * 0.5,
          ey + (Constants.BLOCKH - Constants.SWITCH_SIZE) * 0.5,
          element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.SWITCH_SIZE, element.h * Constants.SWITCH_SIZE)
          .setMask(mask);
          gameSwitch.bonusId = bonusId++;

        break;
        case "switchDead":
          gameSwitch = this.level.switchDeadGroup
          .create(ex + (Constants.BLOCKW - Constants.SWITCH_SIZE) * 0.5,
          ey + (Constants.BLOCKH - Constants.SWITCH_SIZE) * 0.5,
          element.type)
          .setOrigin(0, 0)
          .setDisplaySize(element.w * Constants.SWITCH_SIZE, element.h * Constants.SWITCH_SIZE)
          .setMask(mask);
          gameSwitch.bonusId = bonusId++;

        break;
        default:
        console.log("Type doesn't exists");
        break;
      }
    });
    console.log(this.level.checkpoints)
    return this.level;

  }
}
// this.level = Level();
