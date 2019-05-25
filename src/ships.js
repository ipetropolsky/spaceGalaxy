import Phaser from 'phaser';

import { SimpleAutoGroup } from './autoGroup';
import { SHIP } from './layers';
import { activate, checkDeadMembers } from './utils';
import LevelManager from './levelManager';

export class Ship extends Phaser.Physics.Arcade.Sprite {
    bulletsCount = 0;

    constructor(scene, x, y, bulletsCount = null) {
        const charged = typeof bulletsCount === 'number';
        super(scene, x, y, 'ship');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);
        this.setRotation(Math.PI);
        this.anims.play(charged ? 'chargedShipFire' : 'shipFire');
        this.bulletsCount = bulletsCount || 0;
    }

    start(x, y, vx, vy) {
        activate(this, x, y, vx, vy);
    }

    changeBulletsCount(amount) {
        this.bulletsCount += amount;
    }

    _fireEnabled = true;
    fire() {
        if (!this.bulletsCount || !this._fireEnabled) {
            return false;
        }
        this.scene.sound.play('shot', { volume: 0.2 });
        this.changeBulletsCount(-1);
        this._fireEnabled = false;
        this.scene.time.addEvent({
            delay: LevelManager.getLevel().shipShotDelay,
            callback: () => {
                this._fireEnabled = true;
            },
        });
        return true;
    }
}

export default class ShipGroup extends SimpleAutoGroup {
    classType = Ship;
    depth = SHIP;

    create(x, y, vx, vy, speed, bulletsCount = null) {
        const charged = typeof bulletsCount === 'number';
        const ship = new Ship(this.scene, x, y, bulletsCount);
        this.add(ship);
        ship.start(x, y, vx, vy);
        ship.setData('speed', speed);
        ship.setData('charged', charged);
        return ship;
    }

    createRandom() {
        const level = LevelManager.getLevel();
        const charged = Math.random() > 1 - level.chargedShipRatio;
        const speed = Math.random();
        const x = 50 + Math.random() * (this.scene.game.config.width - 100);
        const y = -50;
        const vx = 0;
        const vy = level.shipMinSpeed + speed * (level.shipMaxSpeed - level.shipMinSpeed);
        return this.create(x, y, vx, vy, speed, charged ? level.chargedShipInitialBullets : null);
    }

    onDeactivate(ship) {
        this.scene.sound.play('missile', { volume: 0.2 + 0.5 * ship.getData('speed') });
    }

    preUpdate() {
        checkDeadMembers(this);
        if (this.target && this.target.active) {
            const level = LevelManager.getLevel();
            this.children.each((ship) => {
                const shipCanFire =
                    (ship.getData('charged') && level.chargedShipCanFire) ||
                    (!ship.getData('charged') && level.shipCanFire);
                if (ship.active && shipCanFire && ship.bulletsCount) {
                    const movesFromLeft =
                        ship.x < this.target.x &&
                        this.target.body.velocity.x < 0 &&
                        this.target.x - ship.x < 3 * this.target.displayWidth;
                    const movesFromRight =
                        ship.x > this.target.x &&
                        this.target.body.velocity.x > 0 &&
                        ship.x - this.target.x < 3 * this.target.displayWidth;
                    if (ship.y < this.target.y && (movesFromLeft || movesFromRight)) {
                        if (ship.fire()) {
                            this.onFire(ship);
                        }
                    }
                }
            });
        }
    }
}
