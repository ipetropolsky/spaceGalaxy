import Phaser from 'phaser';

import { SimpleAutoGroup } from './autoGroup';
import { BULLET } from './layers';
import { activate, deactivate } from './utils';

const SLOW_DOWN_FACTOR = 2;

class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'blowUp');
    }

    fire(x, y, vx, vy, extra = { silent: false }) {
        activate(this, x, y, vx / SLOW_DOWN_FACTOR, vy / SLOW_DOWN_FACTOR);
        this.body.setAngularVelocity(100);
        this.on('animationcomplete', () => {
            deactivate(this);
        });
        this.anims.play('blowUp');
        extra.silent || this.scene.sound.play('blowUp', { volume: 0.5 });
    }
}

export default class ExplosionGroup extends SimpleAutoGroup {
    classType = Explosion;
    depth = BULLET;

    blowUp(gameObject, extra = {}) {
        const explosion = this.get();
        explosion.fire(gameObject.x, gameObject.y, gameObject.body.velocity.x, gameObject.body.velocity.y, extra);
    }

    bump(gameObject1, gameObject2, extra = {}) {
        const explosion = this.get();
        explosion.fire(
            (gameObject1.x + gameObject2.x) / 2,
            (gameObject1.y + gameObject2.y) / 2,
            (gameObject1.body.velocity.x + gameObject2.body.velocity.x) / 2,
            (gameObject1.body.velocity.y + gameObject2.body.velocity.y) / 2,
            extra
        );
    }
}
