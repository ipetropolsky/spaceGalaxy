import Phaser from 'phaser';

import { SHIP } from './layers';
import { BULLETS_COUNT, SHIPS_COUNT, APPLES_COUNT } from './scenes/info';
import { leadTo } from './utils';
import LevelManager from './levelManager';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    bulletsCount = 0;
    shipsCount = 0;
    applesCount = 0;

    constructor(scene, x, y) {
        super(scene, x, y, 'hero');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.stroke = scene.physics.add
            .sprite(x, y, 'strokeHero')
            .setScale(2, 2)
            .setVisible(false);

        const level = LevelManager.getLevel();

        this.setDepth(SHIP);
        this.body.setSize(23, 31);
        this.body.setOffset(0, 1);
        this.setScale(2, 2);
        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(level.playerVelocityMax);

        this.changeBulletsCount(+level.playerInitialBullets);
        this.changeShipsCount(0);
        this.changeApplesCount(0);

        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.input.keyboard.on('keydown-SPACE', () => {
            this.fire();
        });
    }

    hit(gameObject) {
        this.stroke.setVisible(true);
        this.stroke.anims.play('strokeHero');
        this.scene.sound.play('defence', { volume: 0.7 });
        this.stroke.on('animationcomplete', () => {
            this.stroke.setVisible(false);
        });
        this.body.velocity.y += gameObject.body.velocity.y / 2;
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
        this.scene.scene.get('info').animateCounter(BULLETS_COUNT);
    }

    changeShipsCount(amount) {
        this.shipsCount += amount;
        this.scene.registry.set(SHIPS_COUNT, this.shipsCount);
        this.scene.scene.get('info').animateCounter(SHIPS_COUNT);
    }

    changeApplesCount(amount, silent = false) {
        this.applesCount += amount;
        this.scene.registry.set(APPLES_COUNT, this.applesCount);
        !silent && this.scene.scene.get('info').animateCounter(APPLES_COUNT);
    }

    updateLevel() {
        const level = LevelManager.getLevel();
        this.body.setMaxVelocity(level.playerVelocityMax);
    }

    preUpdate() {
        super.preUpdate.apply(this, arguments);

        const level = LevelManager.getLevel();
        let frame = 1;

        if (this.cursors.left.isDown) {
            this.body.velocity.x -= level.playerVelocityStepUp;
            frame += 3;
        } else if (this.cursors.right.isDown) {
            this.body.velocity.x += level.playerVelocityStepUp;
            frame += 6;
        } else if (this.body.velocity.x) {
            this.body.velocity.x = leadTo(0, this.body.velocity.x, level.playerVelocityStepDown);
        }

        if (this.cursors.up.isDown) {
            this.body.velocity.y -= level.playerVelocityStepUp;
            frame -= 1;
        } else if (this.cursors.down.isDown) {
            this.body.velocity.y += level.playerVelocityStepUp;
            frame += 1;
        } else if (this.body.velocity.y) {
            this.body.velocity.y = leadTo(0, this.body.velocity.y, level.playerVelocityStepDown);
        }

        this.setFrame(frame);
        this.stroke.setPosition(this.x, this.y);
        this.stroke.setVelocity(this.body.velocity.x, this.body.velocity.y);
    }
}
