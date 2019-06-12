import Phaser from 'phaser';

import AutoGroup from 'src/autoGroup';
import { BULLET } from 'src/layers';
import { activate } from 'src/utils';
import LevelManager from 'src/levelManager';

class Apple extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'apple');
    }

    put(x, y, vx, vy) {
        activate(this, x, y, vx, vy);
        this.setScale(1.5);
        this.anims.play('appleRotation');
    }
}

export default class AppleGroup extends AutoGroup {
    classType = Apple;
    depth = BULLET;

    createOne(x, y, vx, vy) {
        const apple = this.get();
        apple.put(x, y, vx, vy);
        return apple;
    }

    createRandom() {
        const level = LevelManager.getLevel();
        const speed = Math.random();
        const x = 50 + Math.random() * (this.scene.game.config.width - 100);
        const y = -50;
        const vx = 0;
        const vy = level.appleMinSpeed + speed * (level.appleMaxSpeed - level.appleMinSpeed);
        const apple = this.createOne(x, y, vx, vy);
        apple.anims.setTimeScale(0.7 + 0.3 * speed);
        return apple;
    }
}
