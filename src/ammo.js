import Phaser from 'phaser';

import AutoGroup from './autoGroup';
import { BULLET } from './layers';
import { activate } from './utils';

const SLOW_DOWN_FACTOR = 2;

class Ammo extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'rocket');
    }

    put(x, y, vx, vy, rotation, count) {
        activate(this, x, y, vx, vy);
        this.body.setAngularVelocity(100);
        this.rotation = rotation;
        this.setData('count', count);
    }
}

export default class AmmoGroup extends AutoGroup {
    classType = Ammo;
    depth = BULLET;

    putFrom(gameObject, count) {
        const activeAmmo = this.getFirstAlive();
        const rotation = activeAmmo ? activeAmmo.rotation : 0;
        const ammo = this.get();
        ammo.put(
            gameObject.x,
            gameObject.y,
            gameObject.body.velocity.x / SLOW_DOWN_FACTOR,
            gameObject.body.velocity.y / SLOW_DOWN_FACTOR,
            rotation,
            count
        );
    }
}
