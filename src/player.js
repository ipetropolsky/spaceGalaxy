import Phaser from 'phaser';

import { SHIP } from './layers';
import { BULLETS_COUNT, SHIPS_COUNT } from './scenes/info';
import { leadToZero } from './utils';

const VELOCITY_MAX = 300;
const VELOCITY_STEP_UP = 10;
const VELOCITY_STEP_DOWN = VELOCITY_STEP_UP * 0.5;
const INITIAL_BULLETS_COUNT = 10;

export default class Player extends Phaser.Physics.Arcade.Image {
    bulletsCount = 0;
    shipsCount = 0;

    constructor(scene, x, y) {
        super(scene, x, y, 'hero');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(SHIP);
        this.setScale(2, 2);
        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(VELOCITY_MAX);

        this.changeBulletsCount(+INITIAL_BULLETS_COUNT);
        this.changeShipsCount(0);

        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.input.keyboard.on('keydown-SPACE', () => {
            this.fire();
        });
    }

    fire() {
        if (!this.active) {
            return;
        }
        if (this.bulletsCount) {
            this.scene.sound.play('shot', { volume: 0.2 });
            this.changeBulletsCount(-1);
            this.onFire();
        } else {
            this.scene.sound.play('emptyGun', { volume: 0.5 });
        }
    }

    changeBulletsCount(amount) {
        this.bulletsCount += amount;
        this.scene.registry.set(BULLETS_COUNT, this.bulletsCount);
    }

    changeShipsCount(amount) {
        this.shipsCount += amount;
        this.scene.registry.set(SHIPS_COUNT, this.shipsCount);
    }

    preUpdate() {
        if (this.cursors.left.isDown) {
            this.body.velocity.x -= VELOCITY_STEP_UP;
        } else if (this.cursors.right.isDown) {
            this.body.velocity.x += VELOCITY_STEP_UP;
        } else if (this.body.velocity.x) {
            this.body.velocity.x = leadToZero(this.body.velocity.x, VELOCITY_STEP_DOWN);
        }

        if (this.cursors.up.isDown) {
            this.body.velocity.y -= VELOCITY_STEP_UP;
        } else if (this.cursors.down.isDown) {
            this.body.velocity.y += VELOCITY_STEP_UP;
        } else if (this.body.velocity.y) {
            this.body.velocity.y = leadToZero(this.body.velocity.y, VELOCITY_STEP_DOWN);
        }
    }
}
