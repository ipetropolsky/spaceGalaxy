import BaseShip from 'src/baseShip';
import { SimpleAutoGroup } from 'src/autoGroup';
import { SHIP } from 'src/layers';
import { updateMembers } from 'src/utils';
import LevelManager from 'src/levelManager';

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
        this.flame = scene.physics.add
            .sprite(x, y - 5, 'shipFlame')
            .setOrigin(0.5, 0)
            .setDepth(SHIP)
            .setRotation(this.rotation)
            .setScale(this.scale);
    }

    updateFlamePosition() {
        this.flame.setPosition(this.x, this.y - this.height);
        this.flame.setVelocity(this.body.velocity.x, this.body.velocity.y);
    }

    setApplesCount(value) {
        const prevHasApples = this.applesCount > 0;
        super.setApplesCount(value);
        const hasApples = this.applesCount > 0;
        if (hasApples !== prevHasApples) {
            this.updateLook();
        }
    }

    updateLook() {
        if (this.applesCount > 0) {
            this.setFrame(this.hasCannon ? 3 : 2);
            this.flame.anims.play('shipRainbowFlame');
        } else {
            this.setFrame(this.hasCannon ? 1 : 0);
            this.flame.anims.play('shipFlame');
        }
    }

    start(x, y, vx, vy, hasCannon, hasApples, speed) {
        super.start(x, y, vx, vy, hasCannon);
        this.flame.setVisible(true);
        this.updateFlamePosition();
        this.speed = speed;
        const level = LevelManager.getLevel();
        if (hasCannon) {
            this.setBulletsCount(level.chargedShipInitialBullets);
        }
        if (hasApples) {
            this.setApplesCount(level.rainbowShipInitialApples);
        }
        this.updateLook();
        // Для выравнивания скорости после столкновений
        this.setTargetVelocity(vx, vy);
    }

    onDeactivate() {
        this.flame.setVisible(false);
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

    hit() {
        super.hit.apply(this, arguments);
        this.updateFlamePosition();
    }

    preUpdate() {
        super.preUpdate.apply(this, arguments);
        this.updateFlamePosition();
    }
}

export default class ShipGroup extends SimpleAutoGroup {
    classType = Ship;
    depth = SHIP;

    createOne(x, y, vx, vy, hasCannon, hasApples, speed) {
        const ship = this.get();
        ship.start(x, y, vx, vy, hasCannon, hasApples, speed);
        return ship;
    }

    createRandom() {
        const level = LevelManager.getLevel();
        const hasApples = Math.random() > 1 - level.rainbowShipRatio;
        const hasCannon = Math.random() > 1 - level.chargedShipRatio;
        const speed = Math.random();
        const x = 50 + Math.random() * (this.scene.game.config.width - 100);
        const y = -50;
        const vx = Math.random() * 2 * level.shipMaxVelocityX - level.shipMaxVelocityX;
        const vy = level.shipMinSpeed + speed * (level.shipMaxSpeed - level.shipMinSpeed);
        return this.createOne(x, y, vx, vy, hasCannon, hasApples, speed);
    }

    onDeactivate(ship) {
        this.scene.sound.play('missile', { volume: 0.2 + 0.5 * ship.speed });
    }

    preUpdate() {
        updateMembers(this);
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
