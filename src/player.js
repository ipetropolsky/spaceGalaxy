import Phaser from 'phaser';

import { SHIP } from './layers';
import { BULLETS_COUNT, SHIPS_COUNT, APPLES_COUNT } from './scenes/info';
import { leadToZero } from './utils';
import LevelManager from './levelManager';

const VELOCITY_MAX = 300;
const VELOCITY_STEP_UP = 10;
const VELOCITY_STEP_DOWN = VELOCITY_STEP_UP * 0.5;

export default class Player extends Phaser.Physics.Arcade.Image {
    bulletsCount = 0;
    shipsCount = 0;
    applesCount = 0;

    constructor(scene, x, y) {
        super(scene, x, y, 'hero');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(SHIP);
        this.setScale(2, 2);
        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(VELOCITY_MAX);

        const level = LevelManager.getLevel();
        this.changeBulletsCount(+level.playerInitialBullets);
        this.changeShipsCount(0);
        this.changeApplesCount(0);

        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.input.keyboard.on('keydown-SPACE', () => {
            this.fire();
        });
    }

    fire() {
        const level = LevelManager.getLevel();
        if (!this.active || !level.playerCanFire) {
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

    changeApplesCount(amount) {
        this.applesCount += amount;
        this.scene.registry.set(APPLES_COUNT, this.applesCount);
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
