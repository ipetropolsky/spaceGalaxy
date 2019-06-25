import Phaser from 'phaser';

import { activate, leadTo } from 'src/utils';

export default class BaseShip extends Phaser.Physics.Arcade.Sprite {
    power = 0.5;

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

    setBulletsCount(value) {
        this.bulletsCount = value;
    }

    changeBulletsCount(amount) {
        this.setBulletsCount(this.bulletsCount + amount);
    }

    setApplesCount(value) {
        this.applesCount = value;
    }

    changeApplesCount(amount) {
        this.setApplesCount(this.applesCount + amount);
    }

    setShipsCount(value) {
        this.shipsCount = value;
    }

    changeShipsCount(amount) {
        this.setShipsCount(this.shipsCount + amount);
    }

    hit(gameObject) {
        this.playHitSound();
        this.changeApplesCount(-1);
        this.body.velocity.y += gameObject.body.velocity.y / 2;
        this.updateStroke();
        this.stroke.setVisible(true);
        this.stroke.anims.play(this.strokeAnimation);
        this.stroke.on('animationcomplete', () => {
            this.stroke.setVisible(false);
        });
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

    correctVelocityX(stepDown) {
        this.body.velocity.x = leadTo(this.targetVelocityX, this.body.velocity.x, stepDown);
    }

    correctVelocityY(stepDown) {
        this.body.velocity.y = leadTo(this.targetVelocityY, this.body.velocity.y, stepDown);
    }

    preUpdate() {
        super.preUpdate.apply(this, arguments);
        this.updateStroke();
    }
}
