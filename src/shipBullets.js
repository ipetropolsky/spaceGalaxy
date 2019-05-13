import Phaser from 'phaser';

import BulletGroup, { Bullet } from './bullets';
import LevelManager from './levelManager';

class ShipBullet extends Bullet {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setRotation(Math.PI);
        const level = LevelManager.getLevel();
        this.speed = Phaser.Math.GetSpeed(level.shipBulletSpeed, 1);
    }

    outOfScreen() {
        return this.y - this.displayHeight / 2 > this.scene.game.config.height;
    }

    preUpdate(time, delta) {
        this.y += this.speed * delta;
    }
}

export default class ShipBulletGroup extends BulletGroup {
    classType = ShipBullet;
}
