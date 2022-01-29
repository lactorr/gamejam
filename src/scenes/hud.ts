//setting game configuration and loading the assets for the loading screen
import constants from '../constants';
import assetCartonAliveBas from '../assets/images/cartonalivebas.png';
import assetCartonAliveHaut from '../assets/images/cartonalivehaut.png';
import assetCartonDeadBas from '../assets/images/cartondeadbas.png';
import assetCartonDeadHaut from '../assets/images/cartondeadhaut.png';
import assetKeys from '../assets/images/touches.png';
import assetBoxLine from '../assets/images/boxline.png';
import assetBoxDoorLine from '../assets/images/doorline.png';
import assetScientist from '../assets/images/scientistline.png';
import assetLine from '../assets/images/line.png';
import level1 from '../assets/levels/level0.json';
import {Player} from '../classes/player';
import {GameScene} from '../scenes/gameScene';

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
    private cartonAliveBas: Phaser.GameObjects.Image;
    private cartonAliveHaut: Phaser.GameObjects.Image;
    private cartonDeadBas: Phaser.GameObjects.Image;
    private cartonDeadHaut: Phaser.GameObjects.Image;
    private lineImage: Phaser.GameObjects.Image;
    private boxImage: Phaser.GameObjects.Image;
    private doorImage: Phaser.GameObjects.Image;
    private scientistImage: Phaser.GameObjects.Image;
    private gameAreaMask: Phaser.Display.Masks.GeometryMask;




    constructor () {
        super('HUD');
    }

    preload() {
        this.load.image('cartonAliveBas', assetCartonAliveBas);
        this.load.image('cartonAliveHaut', assetCartonAliveHaut);
        this.load.image('cartonDeadBas', assetCartonDeadBas);
        this.load.image('cartonDeadHaut', assetCartonDeadHaut);
        this.load.image('keys', assetKeys);
        this.load.image('boxline', assetBoxLine);
        this.load.image('doorline', assetBoxDoorLine);
        this.load.image('scientistline', assetScientist);
        this.load.image('line', assetLine);
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

        this.cartonAliveHaut  = this.add.image(0, -30, 'cartonAliveHaut').setOrigin(0, 0);
        this.cartonDeadHaut = this.add.image(0, -20, 'cartonDeadHaut').setOrigin(0, 0).setVisible(false);
        this.cartonAliveBas = this.add.image(0, constants.GAME_HEIGHT, 'cartonAliveBas').setOrigin(0, 1);
        this.cartonDeadBas  = this.add.image(0, constants.GAME_HEIGHT, 'cartonDeadBas').setOrigin(0, 1).setVisible(false);
        this.add.image(0, constants.GAME_HEIGHT, 'keys').setOrigin(0, 1);
        //this.add.image(0, -30, 'cartonDeadBas').setOrigin(0, 0);
        //this.add.image(0, -300, 'cartonAliveBas');
        //this.add.image(0, 0, 'cartonAliveBas');
        //this.add.image(0, 0, 'cartonAliveBas');

        /*inputsEventsCenter.on('debugPressed', () => {
            this.isDebugVisible = !this.isDebugVisible;
            this.debugPadText.setVisible(this.isDebugVisible);
        });*/

    // LIGNE DU POURSUIVANT
    this.lineImage = this.add.image(50, 370, 'line')
        .setOrigin(0.5, 0.5)
        .setSize(2219, 49)
        .setDisplaySize(2219 * 0.3, 49 * 0.3);
    this.boxImage = this.add.image(100, 370, 'boxline')
        .setOrigin(0.5, 0.5)
        .setSize(207, 109)
        .setDisplaySize(207 * 0.4, 109 * 0.4);
    this.doorImage = this.add.image(680, 370, 'doorline')
        .setOrigin(0.5, 0.5)
        .setSize(197, 240)
        .setDisplaySize(197 * 0.3, 240 * 0.3);
    this.scientistImage = this.add.image(30, 370, 'scientistline')
        .setOrigin(0.5, 0.5)
        .setSize(178, 249)
        .setDisplaySize(178 * 0.4, 249 * 0.4);

        // Mouvement de la box
        const gamescene = this.game.scene.getScene('GameScene') as GameScene;
        var lineWidth = this.lineImage.displayWidth;
        const boxOffset = (gamescene.playerAlive.gameObject.x + gamescene.playerDead.gameObject.x)*.5;
        const shape1 = (this.make.graphics as any)().fillStyle(0xffffff).fillRect(
            -constants.GAMEAREA_WIDTH/2, -constants.GAMEAREA_HEIGHT/2, constants.GAMEAREA_WIDTH, constants.GAMEAREA_HEIGHT);
        this.gameAreaMask = shape1.createGeometryMask();
        this.gameAreaMask.geometryMask.x = boxOffset;
        var completePercent = ( boxOffset / Number(gamescene.level.levelWidth));
        this.boxImage.x = this.scientistImage.x + lineWidth*completePercent;

        // var timeline = this.tweens.createTimeline();
    
        // timeline.add ({
        //     targets: this.scientistImage,
        //     x: 650,
        //     ease: 'Linear',
        //     duration: constants.TIMER
        // });

    }

    update(time, delta) {
        const gameScene: any = this.game.scene.getScene('GameScene');

        if (gameScene.controlledPlayer === gameScene.playerAlive) {
            this.cartonAliveBas.setVisible(true);
            this.cartonAliveHaut.setVisible(false);
            this.cartonDeadBas.setVisible(false);
            this.cartonDeadHaut.setVisible(false);
        }
        else {
            this.cartonAliveBas.setVisible(false);
            this.cartonAliveHaut.setVisible(false);
            this.cartonDeadBas.setVisible(true);
            this.cartonDeadHaut.setVisible(false);
        }

        let debug = [];

        const fps = Math.round(1000/delta * 100)/100;
        debug.push('FPS:' + fps);
        debug.push('debug:\n' + debugText);
        this.debugPadText.setText(debug);
    }
}
