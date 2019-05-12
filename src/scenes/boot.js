import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
    constructor() {
        super('boot');
    }

    create() {
        this.scene.start('sky');
        this.scene.start('info');
        this.scene.start('main');
    }
}
