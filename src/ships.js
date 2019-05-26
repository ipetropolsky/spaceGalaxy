import BaseShip from './baseShip';
import { SimpleAutoGroup } from './autoGroup';
import { SHIP } from './layers';
import { checkDeadMembers } from './utils';
import LevelManager from './levelManager';

export class Ship extends BaseShip {
    setDefaults() {
        super.setDefaults();
        this.rotation = Math.PI;
        this.strokeTexture = 'strokeShip';
        this.strokeAnimation = 'strokeShip';
        this.speed = 0;
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'ship');
    }

    setApplesCount(value) {
        const prevHasApples = this.applesCount > 0;
        super.setApplesCount(value);
        const hasApples = this.applesCount > 0;
        if (hasApples !== prevHasApples) {
            if (hasApples) {
                this.anims.play(this.hasCannon ? 'chargedShipRainbowFire' : 'shipRainbowFire');
            } else {
                this.anims.play(this.hasCannon ? 'chargedShipFire' : 'shipFire');
            }
        }
    }

    start(x, y, vx, vy, hasCannon, speed) {
        super.start(x, y, vx, vy, hasCannon);
        this.speed = speed;
        if (this.hasCannon) {
            this.setTexture('chargedShip');
            this.anims.play('chargedShipFire');
            const level = LevelManager.getLevel();
            this.setBulletsCount(level.chargedShipInitialBullets);
        } else {
            this.setTexture('ship');
            this.anims.play('shipFire');
        }
        // Для выравнивания скорости после столкновений
        this.setTargetVelocity(vx, vy);
    }

    fireEnabled() {
        return super.fireEnabled() && LevelManager.getLevel().shipCanFire;
    }

    applyFireDelay() {
        this._fireEnabled = false;
        this.scene.time.addEvent({
            delay: LevelManager.getLevel().shipShotDelay,
            callback: () => {
                this._fireEnabled = true;
            },
        });
    }
}

export default class ShipGroup extends SimpleAutoGroup {
    classType = Ship;
    depth = SHIP;

    createOne(x, y, vx, vy, hasCannon, speed) {
        const ship = this.get();
        ship.start(x, y, vx, vy, hasCannon, speed);
        return ship;
    }

    createRandom() {
        const level = LevelManager.getLevel();
        const hasCannon = Math.random() > 1 - level.chargedShipRatio;
        const speed = Math.random();
        const x = 50 + Math.random() * (this.scene.game.config.width - 100);
        const y = -50;
        const vx = Math.random() * 2 * level.shipMaxVelocityX - level.shipMaxVelocityX;
        const vy = level.shipMinSpeed + speed * (level.shipMaxSpeed - level.shipMinSpeed);
        return this.createOne(x, y, vx, vy, hasCannon, speed);
    }

    onDeactivate(ship) {
        this.scene.sound.play('missile', { volume: 0.2 + 0.5 * ship.speed });
    }

    preUpdate() {
        checkDeadMembers(this);
        if (this.target && this.target.active) {
            this.children.each((ship) => {
                if (ship.active && ship.fireEnabled() && ship.bulletsCount) {
                    const movesFromLeft =
                        ship.x < this.target.x &&
                        this.target.body.velocity.x < 0 &&
                        this.target.x - ship.x < 3 * this.target.displayWidth;
                    const movesFromRight =
                        ship.x > this.target.x &&
                        this.target.body.velocity.x > 0 &&
                        ship.x - this.target.x < 3 * this.target.displayWidth;
                    if (ship.y < this.target.y && (movesFromLeft || movesFromRight)) {
                        ship.fire();
                        this.onFire(ship);
                    }
                }
            });
        }
    }
}
