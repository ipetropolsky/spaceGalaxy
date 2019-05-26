import BaseShip from './baseShip';
import { SHIP } from './layers';
import LevelManager from './levelManager';

export default class Player extends BaseShip {
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

    emptyShot() {
        this.scene.sound.play('emptyGun', { volume: 0.4 });
    }

    updateLevel() {
        const level = LevelManager.getLevel();
        this.body.setMaxVelocity(level.playerVelocityMax);
    }

    userControl() {
        const level = LevelManager.getLevel();
        let frame = 1;

        if (this.cursors.left.isDown) {
            this.body.velocity.x -= level.playerVelocityStepUp;
            frame += 3;
        } else if (this.cursors.right.isDown) {
            this.body.velocity.x += level.playerVelocityStepUp;
            frame += 6;
        } else {
            this.correctVelocityX();
        }

        if (this.cursors.up.isDown) {
            this.body.velocity.y -= level.playerVelocityStepUp;
            frame -= 1;
        } else if (this.cursors.down.isDown) {
            this.body.velocity.y += level.playerVelocityStepUp;
            frame += 1;
        } else {
            this.correctVelocityY();
        }

        this.setFrame(frame);
    }

    preUpdate() {
        this.userControl();
        this.updateStroke();
    }
}
