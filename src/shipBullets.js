import Phaser from 'phaser';

import BulletGroup, { Bullet } from './bullets';
import LevelManager from './levelManager';
import { activate } from './utils';

class ShipBullet extends Bullet {
    fire(x, y, vx, vy) {
        const level = LevelManager.getLevel();
        activate(this, x, y, vx, vy + (this.up ? -1 : 1) * level.shipBulletVelocity);
        this.setAcceleration(0, (this.up ? -1 : 1) * level.shipBulletAcceleration);
        this.setRotation(Math.PI);
        this.setDamping(true);
    }
}

export default class ShipBulletGroup extends BulletGroup {
    classType = ShipBullet;
}
