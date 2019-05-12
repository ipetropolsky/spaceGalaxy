import Phaser from 'phaser';

import { SimpleAutoGroup } from './autoGroup';
import { SHIP } from './layers';
import { activate, checkDeadMembers } from './utils';

const MIN_SHIP_SPEED = 100;
const MAX_SHIP_SPEED = 300;

export class Ship extends Phaser.Physics.Arcade.Sprite {
    bulletsCount = 0;

    constructor(scene, x, y, bulletsCount = 0) {
        super(scene, x, y, bulletsCount ? 'shipWithAmmo' : 'ship');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);
        this.setRotation(Math.PI);
        this.anims.play(bulletsCount ? 'shipWithAmmoFire' : 'shipFire');
        this.bulletsCount = bulletsCount;
    }

    start(x, y, vx, vy) {
        activate(this, x, y, vx, vy);
    }

    outOfScreen() {
        return this.y - this.displayHeight / 2 > this.scene.game.config.height;
    }
}

export default class ShipGroup extends SimpleAutoGroup {
    classType = Ship;
    depth = SHIP;

    createRandom(charged) {
        const speed = Math.random();

        const x = 50 + Math.random() * (this.scene.game.config.width - 100);
        const y = -50;
        const vx = 0;
        const vy = MIN_SHIP_SPEED + speed * (MAX_SHIP_SPEED - MIN_SHIP_SPEED);

        const ship = new Ship(this.scene, x, y, charged ? 1 : 0);
        this.add(ship);

        ship.start(x, y, vx, vy);
        ship.setData('speed', speed);
        ship.setData('charged', charged);

        return ship;
    }

    onDeactivate(ship) {
        this.scene.sound.play('missile', { volume: 0.2 + 0.5 * ship.getData('speed') });
    }

    preUpdate() {
        checkDeadMembers(this);
        if (this.target && this.target.active) {
            this.children.each((ship) => {
                if (ship.active && ship.bulletsCount) {
                    const movesFromLeft =
                        ship.x < this.target.x &&
                        this.target.body.velocity.x < 0 &&
                        this.target.x - ship.x < 3 * this.target.displayWidth;
                    const movesFromRight =
                        ship.x > this.target.x &&
                        this.target.body.velocity.x > 0 &&
                        ship.x - this.target.x < 3 * this.target.displayWidth;
                    if (ship.y < this.target.y && (movesFromLeft || movesFromRight)) {
                        if (this.onFire(ship)) {
                            this.scene.sound.play('shot', { volume: 0.2 });
                            ship.bulletsCount -= 1;
                        }
                    }
                }
            });
        }
    }
}
