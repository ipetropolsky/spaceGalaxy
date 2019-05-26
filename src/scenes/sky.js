import Phaser from 'phaser';

const sceneSpeed = 1;

export default class Sky extends Phaser.Scene {
    constructor() {
        super('sky');
    }

    preload() {
        this.load.image('sky', 'src/assets/sky.png');
    }

    create() {
        this.sky = this.add.tileSprite(400, 300, 1920, 2156, 'sky');
        this.sky.setScale(0.42);

        this.cameras.main.fadeIn(1000);
    }

    update() {
        this.sky.tilePositionY -= sceneSpeed;
    }
}
