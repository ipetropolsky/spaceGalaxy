import Phaser from 'phaser';

import AmmoGroup from '../ammo';
import BulletGroup from '../bullets';
import ExplosionGroup from '../explosions';
import Player from '../player';
import ShipBulletGroup from '../shipBullets';
import ShipGroup from '../ships';
import { deactivate } from '../utils';

const BULLETS_BONUS = 2;

export default class Main extends Phaser.Scene {
    constructor() {
        super('main');
    }

    preload() {
        this.load.image('hero', 'src/assets/hero.png');
        this.load.image('rocket', 'src/assets/rocket.png');
        this.load.spritesheet('ship', 'src/assets/ship.png', { frameWidth: 28, frameHeight: 14 });
        this.load.spritesheet('shipWithAmmo', 'src/assets/shipWithAmmo.png', {
            frameWidth: 28,
            frameHeight: 14,
        });
        this.load.spritesheet('blowUp', 'src/assets/blowUp.png', {
            frameWidth: 400,
            frameHeight: 288,
        });

        this.load.audio('blowUpHero', 'src/assets/blowUpHero.mp3', {
            instances: 1,
        });
        this.load.audio('blowUp', 'src/assets/blowUp.mp3', {
            instances: 3,
        });
        this.load.audio('shot', 'src/assets/shot.mp3', {
            instances: 5,
        });
        this.load.audio('emptyGun', 'src/assets/emptyGun.mp3', {
            instances: 3,
        });
        this.load.audio('missile', 'src/assets/missile.mp3', {
            instances: 3,
        });
        this.load.audio('ammo', 'src/assets/ammo.mp3', {
            instances: 3,
        });
    }

    create() {
        this.anims.create({
            key: 'shipFire',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: Infinity,
        });

        this.anims.create({
            key: 'shipWithAmmoFire',
            frames: this.anims.generateFrameNumbers('shipWithAmmo', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: Infinity,
        });

        this.anims.create({
            key: 'blowUp',
            frames: this.anims.generateFrameNumbers('blowUp', { start: 0, end: 20 }),
            frameRate: 40,
            repeat: 0,
        });

        this.player = new Player(this, 400, 300);
        this.player.onFire = () => {
            this.bullets.fireFrom(this.player);
        };

        const eventConfig = {
            delay: 1000,
            callback: () => {
                this.ships.createRandom(Math.random() > 0.6);
                this.time.addEvent({
                    callback: eventConfig.callback,
                    delay: 750 + Math.random() * 750,
                });
            },
        };
        this.time.addEvent(eventConfig);

        this.ships = new ShipGroup(this.physics.world, this);
        this.bullets = new BulletGroup(this.physics.world, this);
        this.shipBullets = new ShipBulletGroup(this.physics.world, this);
        this.ammo = new AmmoGroup(this.physics.world, this);
        this.explosions = new ExplosionGroup(this.physics.world, this);

        this.ships.target = this.player;
        this.ships.onFire = (ship) => {
            this.shipBullets.fireFrom(ship);
        };

        const destroyShip = (ship) => {
            if (ship.getData('charged')) {
                this.ammo.putFrom(ship);
            }
            ship.destroy();
        };

        this.physics.add.overlap(this.player, this.ships, (player, ship) => {
            if (player.active) {
                this.explosions.bump(player, ship, { silent: true });
                this.sound.play('blowUpHero', { volume: 0.5 });
                destroyShip(ship);
                player.disableBody(true, true);
            }
        });

        this.physics.add.overlap([this.player, this.ships], this.ammo, (object1, object2) => {
            if (object1.active && object2.active) {
                const [ammo, player] = this.ammo.contains(object1) ? [object1, object2] : [object2, object1];
                this.sound.play('ammo', { volume: 0.5 });
                player.changeBulletsCount(+BULLETS_BONUS);
                deactivate(ammo);
            }
        });

        this.physics.add.overlap(this.ships, this.ships, (ship1, ship2) => {
            if (ship1.active && ship2.active) {
                this.explosions.bump(ship1, ship2);
                this.player.changeShipsCount(+2);
                destroyShip(ship1);
                destroyShip(ship2);
            }
        });

        this.physics.add.overlap([this.bullets, this.shipBullets], this.ships, (object1, object2) => {
            if (object1.active && object2.active) {
                const [ship, bullet] = this.ships.contains(object1) ? [object1, object2] : [object2, object1];
                if (bullet.getData('owner') !== ship) {
                    this.explosions.blowUp(ship);
                    this.player.changeShipsCount(+1);
                    deactivate(bullet);
                    destroyShip(ship);
                }
            }
        });

        this.physics.add.overlap(this.player, this.shipBullets, (player, bullet) => {
            if (bullet.active && player.active) {
                this.explosions.blowUp(player, { silent: true });
                this.sound.play('blowUpHero', { volume: 0.5 });
                deactivate(bullet);
                player.disableBody(true, true);
            }
        });

        this.physics.add.overlap(this.bullets, this.shipBullets, (bullet1, bullet2) => {
            if (bullet1.active && bullet2.active) {
                this.explosions.bump(bullet1, bullet2);
                deactivate(bullet1);
                deactivate(bullet2);
            }
        });
    }
}
