import Phaser from 'phaser';

import { activate, leadTo } from 'src/utils';
import LevelManager from 'src/levelManager';

export default class BaseShip extends Phaser.Physics.Arcade.Sprite {
    setDefaults() {
        this.scale = 2;
        this.rotation = 0;
        this.strokeTexture = null;
        this.strokeAnimation = null;
        this.targetVelocityX = 0;
        this.targetVelocityY = 0;
        this.bulletsCount = 0;
        this.applesCount = 0;
        this.shipsCount = 0;
        this.hasCannon = false;
    }

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.setDefaults();
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.stroke = scene.physics.add
            .sprite(x, y, this.strokeTexture)
            .setRotation(this.rotation)
            .setScale(this.scale)
            .setVisible(false);

        this.setScale(this.scale);
        this.setRotation(this.rotation);

        const level = LevelManager.getLevel();
        this.velocityStepDown = level.playerVelocityStepDown;
    }

    playHitSound() {
        this.scene.sound.play('defence', { volume: 0.7 });
    }

    playShotSound() {
        this.scene.sound.play('shot', { volume: 0.2 });
    }

    playAmmoSound() {
        this.scene.sound.play('ammo', { volume: 0.5 });
    }

    playAppleSound() {
        this.scene.sound.play('collectLovely', { volume: 0.2 });
    }

    onChangeBulletsCount() {}

    setBulletsCount(value) {
        if (this.bulletsCount !== value) {
            this.bulletsCount = value;
            this.onChangeBulletsCount(value);
        }
    }

    changeBulletsCount(amount) {
        this.setBulletsCount(this.bulletsCount + amount);
    }

    onChangeApplesCount() {}

    setApplesCount(value) {
        if (this.applesCount !== value) {
            this.applesCount = value;
            this.onChangeApplesCount(value);
        }
    }

    changeApplesCount(amount) {
        this.setApplesCount(this.applesCount + amount);
    }

    onChangeShipsCount() {}

    setShipsCount(value) {
        if (this.shipsCount !== value) {
            this.shipsCount = value;
            this.onChangeShipsCount(this.shipsCount);
        }
    }

    changeShipsCount(amount) {
        this.setShipsCount(this.shipsCount + amount);
    }

    hit(gameObject) {
        this.playHitSound();
        this.changeApplesCount(-1);
        this.stroke.setVisible(true);
        this.stroke.anims.play(this.strokeAnimation);
        this.stroke.on('animationcomplete', () => {
            this.stroke.setVisible(false);
        });
        this.body.velocity.y += gameObject.body.velocity.y / 2;
    }

    collectAmmo(count) {
        this.playAmmoSound();
        this.changeBulletsCount(count);
    }

    collectApple() {
        this.playAppleSound();
        this.changeApplesCount(+1);
    }

    setTargetVelocity(vx, vy) {
        this.targetVelocityX = vx;
        this.targetVelocityY = vy;
    }

    updateStroke() {
        this.stroke.setPosition(this.x, this.y);
        this.stroke.setVelocity(this.body.velocity.x, this.body.velocity.y);
    }

    start(x, y, vx, vy, hasCannon) {
        activate(this, x, y, vx, vy);
        this.updateStroke();
        this.hasCannon = hasCannon;
        this.setApplesCount(0);
        this.setBulletsCount(0);
    }

    _fireEnabled = true;
    fireEnabled() {
        return this.hasCannon && this._fireEnabled;
    }
    applyFireDelay() {}
    onFire() {}
    emptyShot() {}

    fire() {
        if (this.fireEnabled()) {
            if (this.bulletsCount > 0) {
                this.playShotSound();
                this.changeBulletsCount(-1);
                this.applyFireDelay();
                this.onFire();
            } else {
                this.emptyShot();
            }
        }
    }

    correctVelocityX() {
        this.body.velocity.x = leadTo(this.targetVelocityX, this.body.velocity.x, this.velocityStepDown);
    }

    correctVelocityY() {
        this.body.velocity.y = leadTo(this.targetVelocityY, this.body.velocity.y, this.velocityStepDown);
    }

    preUpdate() {
        super.preUpdate.apply(this, arguments);
        this.correctVelocityX();
        this.correctVelocityY();
        this.updateStroke();
    }
}
