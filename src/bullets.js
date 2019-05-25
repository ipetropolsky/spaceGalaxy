import Phaser from 'phaser';

import AutoGroup from './autoGroup';
import { BULLET } from './layers';
import { activate } from './utils';
import LevelManager from './levelManager';

export class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'rocket');
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    fire(x, y, vx, vy) {
        const level = LevelManager.getLevel();
        activate(this, x, y, vx, vy - level.bulletVelocity);
        this.setAcceleration(0, -level.bulletAcceleration);
        this.setDamping(true);
    }
}

export default class BulletGroup extends AutoGroup {
    runChildUpdate = true;
    classType = Bullet;
    depth = BULLET;
    defaults = {
        setDragX: 0.975,
        setDragY: 1,
    };

    fireFrom(gameObject) {
        const bullet = this.get();
        bullet.setData('owner', gameObject);
        bullet.fire(gameObject.x, gameObject.y, gameObject.body.velocity.x, gameObject.body.velocity.y);
    }
}
