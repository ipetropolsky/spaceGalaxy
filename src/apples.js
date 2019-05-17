import Phaser from 'phaser';

import AutoGroup from './autoGroup';
import { BULLET } from './layers';
import { activate } from './utils';
import LevelManager from './levelManager';

class Apple extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'apple');
    }

    put(x, y, vx, vy) {
        activate(this, x, y, vx, vy);
        this.setScale(1.5);
        this.setRotation((Phaser.Math.RND.between(-30, 30) * Math.PI) / 180);
        this.setAngularVelocity(Phaser.Math.RND.between(80, 120));
    }
}

export default class AppleGroup extends AutoGroup {
    classType = Apple;
    depth = BULLET;

    createOne(x, y, vx, vy) {
        const apple = this.get();
        apple.setData('owner', null);
        apple.put(x, y, vx, vy);
        return apple;
    }

    createRandom() {
        const level = LevelManager.getLevel();
        const speed = Math.random();
        const x = 50 + Math.random() * (this.scene.game.config.width - 100);
        const y = -50;
        const vx = 0;
        const vy = level.shipMinSpeed + speed * (level.shipMaxSpeed - level.shipMinSpeed);
        return this.createOne(x, y, vx, vy);
    }
}
