import Phaser from 'phaser';

import AutoGroup from './autoGroup';
import { BULLET } from './layers';
import { activate, leadToZero } from './utils';
import LevelManager from './levelManager';

const VELOCITY_STEP_DOWN = 3;

export class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'rocket');
        const level = LevelManager.getLevel();
        this.speed = Phaser.Math.GetSpeed(level.bulletSpeed, 1);
    }

    fire(x, y, vx, vy) {
        activate(this, x, y, vx, vy);
    }

    preUpdate(time, delta) {
        this.y -= this.speed * delta;
        if (this.active) {
            this.body.velocity.x = leadToZero(this.body.velocity.x, VELOCITY_STEP_DOWN);
            this.body.velocity.y = leadToZero(this.body.velocity.y, VELOCITY_STEP_DOWN);
        }
    }
}

export default class BulletGroup extends AutoGroup {
    runChildUpdate = true;
    classType = Bullet;
    depth = BULLET;

    fireFrom(gameObject) {
        const bullet = this.get();
        bullet.setData('owner', gameObject);
        bullet.fire(gameObject.x, gameObject.y, gameObject.body.velocity.x, gameObject.body.velocity.y);
    }
}
