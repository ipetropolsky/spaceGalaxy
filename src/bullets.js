import Phaser from 'phaser';

import AutoGroup from './autoGroup';
import { BULLET } from './layers';
import { activate, leadToZero } from './utils';

const DEFAULT_SPEED = Phaser.Math.GetSpeed(400, 1);
const VELOCITY_STEP_DOWN = 3;

export class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'rocket');
        this.speed = DEFAULT_SPEED;
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

    outOfScreen() {
        return this.y < -this.displayHeight / 2;
    }
}

export default class BulletGroup extends AutoGroup {
    runChildUpdate = true;
    classType = Bullet;
    depth = BULLET;

    fireFrom(gameObject) {
        const bullet = this.get();
        bullet && bullet.fire(gameObject.x, gameObject.y, gameObject.body.velocity.x, gameObject.body.velocity.y);
        return !!bullet;
    }
}
