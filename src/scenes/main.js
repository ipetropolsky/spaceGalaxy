import Phaser from 'phaser';

import AmmoGroup from '../ammo';
import AppleGroup from '../apples';
import BulletGroup from '../bullets';
import ExplosionGroup, { ExplosionGroup2 } from '../explosions';
import Player from '../player';
import ShipBulletGroup from '../shipBullets';
import ShipGroup from '../ships';
import { deactivate } from '../utils';
import LevelManager from '../levelManager';
import { SHIP_APPLES_COUNT, SHIP_HERO_COUNT } from './info';

export default class Main extends Phaser.Scene {
    constructor() {
        super('main');
        this.shipHeroCount = 0;
        this.shipApplesCount = 0;
    }

    preload() {
        this.load.image('apple', 'src/assets/apple.png');
        this.load.spritesheet('hero', 'src/assets/hero.png', {
            frameWidth: 23,
            frameHeight: 33,
        });
        this.load.spritesheet('strokeHero', 'src/assets/strokeHero.png', {
            frameWidth: 35,
            frameHeight: 45,
        });
        this.load.spritesheet('strokeShip', 'src/assets/strokeShip.png', {
            frameWidth: 40,
            frameHeight: 32,
        });
        this.load.image('rocket', 'src/assets/rocket.png');
        this.load.spritesheet('ship', 'src/assets/ship.png', {
            frameWidth: 28,
            frameHeight: 14,
        });
        this.load.spritesheet('blowUp', 'src/assets/blowUp.png', {
            frameWidth: 400,
            frameHeight: 288,
        });
        this.load.spritesheet('blowUp2', 'src/assets/blowUp2.png', {
            frameWidth: 588,
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
        this.load.audio('collectRetro', 'src/assets/collectRetro.mp3', {
            instances: 3,
        });
        this.load.audio('collectLovely', 'src/assets/collectLovely.mp3', {
            instances: 3,
        });
        this.load.audio('defence', 'src/assets/defence.mp3', {
            instances: 3,
        });
    }

    create() {
        const restartGame = () => {
            this.cameras.main.on('camerafadeoutcomplete', () => {
                this.scene.restart();
            });
            this.cameras.main.fade(2000);
            if (this.player.applesCount) {
                window.setTimeout(() => {
                    this.time.addEvent({
                        delay: 40,
                        callback: () => {
                            this.player.changeApplesCount(-1, true);
                        },
                        repeat: this.player.applesCount - 1,
                    });
                }, 1500 - 45 * this.player.applesCount);
            }
        };

        this.anims.create({
            key: 'strokeHero',
            frames: this.anims.generateFrameNumbers('strokeHero', { start: 0, end: 6 }),
            frameRate: 40,
            repeat: 0,
        });

        this.anims.create({
            key: 'strokeShip',
            frames: this.anims.generateFrameNumbers('strokeShip', { start: 0, end: 6 }),
            frameRate: 40,
            repeat: 0,
        });

        this.anims.create({
            key: 'shipFire',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: Infinity,
        });

        this.anims.create({
            key: 'chargedShipFire',
            frames: this.anims.generateFrameNumbers('ship', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: Infinity,
        });

        this.anims.create({
            key: 'shipRainbowFire',
            frames: this.anims.generateFrameNumbers('ship', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: Infinity,
        });

        this.anims.create({
            key: 'chargedShipRainbowFire',
            frames: this.anims.generateFrameNumbers('ship', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: Infinity,
        });

        this.anims.create({
            key: 'blowUp',
            frames: this.anims.generateFrameNumbers('blowUp', { start: 0, end: 20 }),
            frameRate: 40,
            repeat: 0,
        });

        this.anims.create({
            key: 'blowUp2',
            frames: this.anims.generateFrameNumbers('blowUp2', { start: 0, end: 16 }),
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
                this.ships.createRandom();
                const level = LevelManager.getLevel();
                this.time.addEvent({
                    callback: eventConfig.callback,
                    delay: Phaser.Math.RND.integerInRange(level.shipFactoryDelayMin, level.shipFactoryDelayMax),
                });
            },
        };
        this.time.addEvent(eventConfig);

        this.ships = new ShipGroup(this.physics.world, this);
        this.bullets = new BulletGroup(this.physics.world, this);
        this.shipBullets = new ShipBulletGroup(this.physics.world, this);
        this.ammo = new AmmoGroup(this.physics.world, this);
        this.explosions = new ExplosionGroup(this.physics.world, this);
        this.explosions2 = new ExplosionGroup2(this.physics.world, this);

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
                this.registry.set(SHIP_HERO_COUNT, ++this.shipHeroCount);
                this.scene.get('info').animateCounter(SHIP_HERO_COUNT);
                restartGame();
            }
        });

        this.physics.add.overlap([this.player, this.ships], this.ammo, (object1, object2) => {
            if (object1.active && object2.active) {
                const [ammo, player] = this.ammo.contains(object1) ? [object1, object2] : [object2, object1];
                this.sound.play('ammo', { volume: 0.5 });
                const level = LevelManager.getLevel();
                player.changeBulletsCount(+level.bulletsInAmmo);
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
                    if (ship.applesCount > 0) {
                        ship.hit(bullet);
                        ship.changeApplesCount(-1);
                        ship.anims.play(ship.getData('charged') ? 'chargedShipFire' : 'shipFire');
                        deactivate(bullet);
                    } else {
                        this.explosions.blowUp(ship);
                        this.player.changeShipsCount(+1);
                        deactivate(bullet);
                        destroyShip(ship);
                    }
                }
            }
        });

        this.physics.add.overlap(this.player, this.shipBullets, (player, bullet) => {
            if (bullet.active && player.active) {
                if (this.player.applesCount > 0) {
                    this.player.hit(bullet);
                    this.player.changeApplesCount(-1);
                    deactivate(bullet);
                } else {
                    this.explosions.blowUp(player, { silent: true });
                    this.sound.play('blowUpHero', { volume: 0.5 });
                    this.registry.set(SHIP_HERO_COUNT, ++this.shipHeroCount);
                    this.scene.get('info').animateCounter(SHIP_HERO_COUNT);
                    deactivate(bullet);
                    player.disableBody(true, true);
                    restartGame();
                }
            }
        });

        this.physics.add.overlap(this.bullets, this.shipBullets, (bullet1, bullet2) => {
            if (bullet1.active && bullet2.active) {
                this.explosions.bump(bullet1, bullet2);
                deactivate(bullet1);
                deactivate(bullet2);
            }
        });

        this.apples = new AppleGroup(this.physics.world, this);
        const eventConfigForApples = {
            delay: 1000,
            callback: () => {
                this.apples.createRandom();
                this.time.addEvent({
                    callback: eventConfigForApples.callback,
                    delay: Phaser.Math.RND.integerInRange(2000, 3000),
                });
            },
        };
        this.time.addEvent(eventConfigForApples);

        this.physics.add.overlap([this.bullets, this.shipBullets], this.apples, (bullet, apple) => {
            if (bullet.active && apple.active) {
                this.explosions2.bump(bullet, apple);
                deactivate(bullet);
                deactivate(apple);
            }
        });

        this.physics.add.overlap([this.player, this.ships], this.apples, (ship, apple) => {
            if (apple.getData('owner') !== ship) {
                if (this.ships.contains(ship)) {
                    this.sound.play('collectLovely', { volume: 0.2 });
                    ship.changeApplesCount(+1);
                    ship.anims.play(ship.getData('charged') ? 'chargedShipRainbowFire' : 'shipRainbowFire');
                    this.registry.set(SHIP_APPLES_COUNT, ++this.shipApplesCount);
                    this.scene.get('info').animateCounter(SHIP_APPLES_COUNT);
                } else {
                    this.sound.play('collectRetro', { volume: 0.4 });
                    ship.changeApplesCount(+1);
                    if (ship.applesCount === 10) {
                        LevelManager.setLevel(1);
                        this.player.updateLevel();
                    }
                    if (ship.applesCount === 20) {
                        LevelManager.setLevel(2);
                        this.player.updateLevel();
                    }
                }
                deactivate(apple);
            }
        });

        this.registry.set(SHIP_APPLES_COUNT, this.shipApplesCount);
        this.registry.set(SHIP_HERO_COUNT, this.shipHeroCount);
        this.cameras.main.fadeIn(1000);
    }
}
