import BaseShip from 'src/baseShip';
import { SimpleAutoGroup } from 'src/autoGroup';
import { SHIP } from 'src/layers';
import { deactivate, updateMembers } from 'src/utils';
import LevelManager from 'src/levelManager';
import { SHIPS_COUNT, SHIP_APPLES_COUNT, SHIP_APPLES_IN_USE } from 'src/registry';

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

    collectApple() {
        super.collectApple();
        this.scene.changeRegistry(SHIP_APPLES_COUNT, +1);
        this.scene.changeRegistry(SHIP_APPLES_IN_USE, +1);
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

    start(x, y, vx, vy, hasCannon, apples, speed) {
        super.start(x, y, vx, vy, hasCannon);
        this.flame.setVisible(true);
        this.updateFlamePosition();
        this.speed = speed;
        const level = LevelManager.getLevel();
        if (hasCannon) {
            this.power = 0.75;
            this.setBulletsCount(level.chargedShipInitialBullets);
        } else {
            this.power = 0.5;
        }
        if (apples) {
            this.setApplesCount(apples);
            this.scene.changeRegistry(SHIP_APPLES_IN_USE, +apples);
        }
        this.updateLook();
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

    hit() {
        super.hit.apply(this, arguments);
        this.updateFlamePosition();
        this.scene.changeRegistry(SHIP_APPLES_COUNT, -1);
        this.scene.changeRegistry(SHIP_APPLES_IN_USE, -1);
    }

    blowUp() {
        deactivate(this);
        this.scene.changeRegistry(SHIPS_COUNT, +1);
        this.scene.changeRegistry(SHIP_APPLES_COUNT, -this.applesCount);
    }

    onDeactivate() {
        this.flame.setVisible(false);
        this.scene.changeRegistry(SHIP_APPLES_IN_USE, -this.applesCount);
    }

    preUpdate() {
        super.preUpdate.apply(this, arguments);
        const level = LevelManager.getLevel();
        this.correctVelocityX(level.shipVelocityStepDown);
        this.correctVelocityY(level.shipVelocityStepDown);
        this.updateFlamePosition();
    }
}

export default class ShipGroup extends SimpleAutoGroup {
    classType = Ship;
    depth = SHIP;

    createOne(x, y, vx, vy, hasCannon, apples, speed) {
        const ship = this.get();
        ship.start(x, y, vx, vy, hasCannon, apples, speed);
        return ship;
    }

    createRandom() {
        const level = LevelManager.getLevel();
        const totalApplesAvailable =
            this.scene.registry.get(SHIP_APPLES_COUNT) - this.scene.registry.get(SHIP_APPLES_IN_USE);
        const shipHasApples = totalApplesAvailable > 0 && Math.random() > 1 - level.rainbowShipRatio;
        const applesCount = shipHasApples ? Math.min(level.rainbowShipInitialApples, totalApplesAvailable) : 0;
        const hasCannon = Math.random() > 1 - level.chargedShipRatio;
        const speed = Math.random();
        const x = 50 + Math.random() * (this.scene.game.config.width - 100);
        const y = -50;
        const vx = Math.random() * 2 * level.shipMaxVelocityX - level.shipMaxVelocityX;
        const vy = level.shipMinSpeed + speed * (level.shipMaxSpeed - level.shipMinSpeed);
        return this.createOne(x, y, vx, vy, hasCannon, applesCount, speed);
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
