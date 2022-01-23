import { InputManager } from '../classes/inputManager';
import { GameScene } from './gameScene';
import assetClicplay from '../assets/images/maintemp.png';

export class MainMenuScene extends Phaser.Scene {
    private inputManager: InputManager;
    private clicplay: Phaser.GameObjects.Image;

    constructor () {
        super('MainMenuScene');
    }

    preload() {
        this.load.image('clicplay', assetClicplay);
    }

    setInputManager(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    create() {
        this.clicplay = this.add.image(0, 0, 'clicplay').setOrigin(0,0);
    }

    update(time, delta) {
        const inputData = this.inputManager.handleInputs();

        //TODO :
        // - Regarder si la touche space est appuyée
        // - Si oui, envoyer un message à GameScene pour lancer le jeu

        if (inputData.jumpDown) {
            this.clicplay.setVisible(false);
            (this.game.scene.getScene('GameScene') as GameScene).startGame();
        }
    }
}
