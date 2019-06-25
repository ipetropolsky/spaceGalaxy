import BaseShip from 'src/baseShip';
import { SHIP } from 'src/layers';
import LevelManager from 'src/levelManager';
import { BULLETS_COUNT, APPLES_COUNT, SHIPS_COUNT, SHIP_HERO_COUNT } from 'src/registry';

export default class Player extends BaseShip {
    power = 1.5;

    setDefaults() {
        super.setDefaults();
        this.scale = 2;
        this.strokeTexture = 'strokeHero';
        this.strokeAnimation = 'strokeHero';
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'hero');

        const level = LevelManager.getLevel();
        this.body.setMaxVelocity(level.playerVelocityMax);
        this.body.setSize(23, 31);
        this.body.setOffset(0, 1);

        this.setDepth(SHIP);
        this.setCollideWorldBounds(true);

        this.hasCannon = level.playerCanFire;
        this.bulletsCount = level.playerInitialBullets;

        this.scene.setRegistry(BULLETS_COUNT, this.bulletsCount);
        this.scene.setRegistry(APPLES_COUNT, this.applesCount);
        this.scene.setRegistry(SHIPS_COUNT, this.shipsCount);

        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.input.keyboard.on('keydown-SPACE', () => {
            this.fire();
        });
    }

    playAppleSound() {
        this.scene.sound.play('collectRetro', { volume: 0.4 });
    }

    fireEnabled() {
        return this.active && super.fireEnabled() && LevelManager.getLevel().playerCanFire;
    }

    setBulletsCount(value) {
        if (value !== this.bulletsCount) {
            super.setBulletsCount(value);
            this.scene.setRegistry(BULLETS_COUNT, value);
        }
    }

    setApplesCount(value) {
        if (value !== this.applesCount) {
            super.setApplesCount(value);
            this.scene.setRegistry(APPLES_COUNT, value);
        }
    }

    setShipsCount(value) {
        if (value !== this.shipsCount) {
            super.setShipsCount(value);
            this.scene.setRegistry(SHIPS_COUNT, value);
        }
    }

    emptyShot() {
        this.scene.sound.play('emptyGun', { volume: 0.4 });
    }

    updateLevel() {
        const level = LevelManager.getLevel();
        this.body.setMaxVelocity(level.playerVelocityMax);
        this.hasCannon = level.playerCanFire;
    }

    userControl() {
        const level = LevelManager.getLevel();
        let frame = 1;

        if (this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.body.velocity.x -= level.playerVelocityStepUp;
            frame += 3;
        } else if (!this.cursors.left.isDown && this.cursors.right.isDown) {
            this.body.velocity.x += level.playerVelocityStepUp;
            frame += 6;
        } else {
            this.correctVelocityX(level.playerVelocityStepDown);
        }

        if (this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.body.velocity.y -= level.playerVelocityStepUp;
            frame -= 1;
        } else if (!this.cursors.up.isDown && this.cursors.down.isDown) {
            this.body.velocity.y += level.playerVelocityStepUp;
            frame += 1;
        } else {
            this.correctVelocityY(level.playerVelocityStepDown);
        }

        this.setFrame(frame);
    }

    hit() {
        super.hit.apply(this, arguments);
        this.updateStroke();
        this.scene.cameras.main.shake(200, 0.005, true);
        this.scene.scene.get('sky').cameras.main.shake(200, 0.005, true);
    }

    blowUp() {
        this.scene.sound.play('blowUpHero', { volume: 0.5 });
        this.disableBody(true, true);
        this.scene.changeRegistry(SHIP_HERO_COUNT, +1);
    }

    preUpdate() {
        this.userControl();
        this.updateStroke();
    }
}
