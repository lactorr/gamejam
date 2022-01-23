import { InputManager } from '../classes/inputManager';
import { GameScene } from './gameScene';

export class MainMenuScene extends Phaser.Scene {
    private inputManager: InputManager;

    constructor () {
        super('MainMenuScene');
    }

    setInputManager(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    create() {
        //TODO :
        // - Créer les éléments visuels (titre, message "press space to start")
    }

    update(time, delta) {
        const inputData = this.inputManager.handleInputs();

        //TODO :
        // - Regarder si la touche space est appuyée
        // - Si oui, envoyer un message à GameScene pour lancer le jeu

        //(this.game.scene.getScene('GameScene') as GameScene).startGame();
    }
}
