import Phaser from 'phaser';

import LevelManager from 'src/levelManager';

export default class Sky extends Phaser.Scene {
    constructor() {
        super('sky');
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
    }

    create() {
        this.sky = this.add.tileSprite(400, 300, 1920, 2156, 'sky');
        this.sky.setScale(0.42);

        this.cameras.main.fadeIn(1000);
    }

    update() {
        const level = LevelManager.getLevel();
        const skySpeed = (level && level.skySpeed) || 1;
        this.sky.tilePositionY -= skySpeed;
    }
}
