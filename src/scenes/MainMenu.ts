import { InputManager } from '../classes/inputManager';
import { GameScene } from './gameScene';
import assetClicplay from '../assets/images/mainscreen.png';
import assetcatalivesit from '../assets/images/catalivesit.png';
import assetcatdeadsit from '../assets/images/catdeadsit.png';

export class MainMenuScene extends Phaser.Scene {
    private inputManager: InputManager;
    private clicplay: Phaser.GameObjects.Image;
    private catalivesitplay: Phaser.GameObjects.Sprite;
    private catalivesitabout: Phaser.GameObjects.Sprite;
    private catdeadsitplay: Phaser.GameObjects.Image;
    private catdeadsitabout: Phaser.GameObjects.Image;

    constructor () {
        super('MainMenuScene');
    }

    preload() {
        this.load.image('clicplay', assetClicplay);
        this.load.image('catalivesit', assetcatalivesit);
        this.load.image('catdeadsit', assetcatdeadsit);
    }

    setInputManager(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    create() {
        this.clicplay = this.add.image(0, 0, 'clicplay').setOrigin(0,0);
        this.catalivesitplay = this.add.sprite(290, 220, 'catalivesit').setOrigin(0,0).setInteractive();
        this.catalivesitabout = this.add.sprite(320, 380, 'catalivesit').setOrigin(0,0).setInteractive();
        this.catdeadsitplay = this.add.image(290, 220, 'catdeadsit').setOrigin(0,0).setVisible(false).setFlipY(true)
        this.catdeadsitabout = this.add.image(320, 380, 'catdeadsit').setOrigin(0,0).setVisible(false).setFlipY(true)

        //Changer le chat quand on passe dessus
        this.catalivesitplay.on('pointerover', function(){
            this.catdeadsitplay.setVisible(true)
        }, this)

        this.catalivesitplay.on('pointerout', function(){
            this.catdeadsitplay.setVisible(false)
        }, this)

        this.catalivesitabout.on('pointerover', function(){
            this.catdeadsitabout.setVisible(true)
        }, this)

        this.catalivesitabout.on('pointerout', function(){
            this.catdeadsitabout.setVisible(false)
        }, this)

        //Lancer le jeu quand on clique sur le chat alive Play
        this.catalivesitplay.on('pointerdown', function(){
            this.scene.sleep();
            (this.game.scene.getScene('GameScene') as GameScene).startGame();
        }, this)

        //Lancer l'écran About quand on clique sur le catdeadsit
        this.catalivesitabout.on('pointerdown', function(){
            this.scene.sleep();
            this.scene.launch('About'); 
        }, this)

    }

    update(time, delta) {
        const inputData = this.inputManager.handleInputs();

        //TODO :
        // - Regarder si la touche space est appuyée
        // - Si oui, envoyer un message à GameScene pour lancer le jeu

        if (inputData.jumpDown) {
            this.scene.sleep();
            (this.game.scene.getScene('GameScene') as GameScene).startGame();
        }
    }
}
