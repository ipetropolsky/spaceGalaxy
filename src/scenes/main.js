import Phaser from 'phaser';

import AmmoGroup from 'src/ammo';
import AppleGroup from 'src/apples';
import BulletGroup from 'src/bullets';
import ExplosionGroup, { ExplosionGroup2 } from 'src/explosions';
import Player from 'src/player';
import ShipBulletGroup from 'src/shipBullets';
import ShipGroup from 'src/ships';
import { deactivate } from 'src/utils';
import LevelManager from 'src/levelManager';

export default class Main extends Phaser.Scene {
    constructor() {
        super('main');
        this.shipHeroCount = 0;
        this.shipApplesCount = 0;
    }

    setRegistry(name, value) {
        this.registry.set(name, value);
        this.scene.get('info').animateCounter(name);
    }

    changeRegistry(name, amount) {
        if (amount) {
            const value = this.registry.get(name) || 0;
            this.registry.set(name, value + amount);
            this.scene.get('info').animateCounter(name);
        }
    }

    preload() {
        this.load.spritesheet('apple', 'assets/appleSprite5deg.png', {
            frameWidth: 28,
            frameHeight: 28,
        });
        this.load.spritesheet('hero', 'assets/hero.png', {
            frameWidth: 23,
            frameHeight: 33,
        });
        this.load.spritesheet('strokeHero', 'assets/strokeHero.png', {
            frameWidth: 35,
            frameHeight: 45,
        });
        this.load.spritesheet('strokeShip', 'assets/strokeShip.png', {
            frameWidth: 40,
            frameHeight: 32,
        });
        this.load.image('rocket', 'assets/rocket.png');
        this.load.spritesheet('ship', 'assets/ship.png', {
            frameWidth: 28,
            frameHeight: 9,
        });
        this.load.spritesheet('shipFlame', 'assets/shipFlame.png', {
            frameWidth: 4,
            frameHeight: 5,
        });
        this.load.spritesheet('blowUp', 'assets/blowUp.png', {
            frameWidth: 400,
            frameHeight: 288,
        });
        this.load.spritesheet('blowUp2', 'assets/blowUp2.png', {
            frameWidth: 588,
            frameHeight: 288,
        });

        this.load.audio('blowUpHero', 'assets/blowUpHero.mp3', {
            instances: 1,
        });
        this.load.audio('blowUp', 'assets/blowUp.mp3', {
            instances: 3,
        });
        this.load.audio('shot', 'assets/shot.mp3', {
            instances: 5,
        });
        this.load.audio('emptyGun', 'assets/emptyGun.mp3', {
            instances: 3,
        });
        this.load.audio('missile', 'assets/missile.mp3', {
            instances: 3,
        });
        this.load.audio('ammo', 'assets/ammo.mp3', {
            instances: 3,
        });
        this.load.audio('collectRetro', 'assets/collectRetro.mp3', {
            instances: 3,
        });
        this.load.audio('collectLovely', 'assets/collectLovely.mp3', {
            instances: 3,
        });
        this.load.audio('defence', 'assets/defence.mp3', {
            instances: 3,
        });
    }

    create() {
        const level = LevelManager.getLevel();
        LevelManager.setLevel(this, level ? level.index : 0, true);

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
                            this.player.changeApplesCount(-1);
                        },
                        repeat: this.player.applesCount - 1,
                    });
                }, 1500 - 45 * this.player.applesCount);
            }
        };

        this.anims.create({
            key: 'appleRotation',
            frames: this.anims.generateFrameNumbers('apple', { start: 0, end: 71 }),
            frameRate: 40,
            repeat: -1,
        });

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
            key: 'shipFlame',
            frames: this.anims.generateFrameNumbers('shipFlame', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: Infinity,
        });

        this.anims.create({
            key: 'shipRainbowFlame',
            frames: this.anims.generateFrameNumbers('shipFlame', { start: 3, end: 5 }),
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

        this.ships = new ShipGroup(this.physics.world, this);
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

        this.apples = new AppleGroup(this.physics.world, this);
        const eventConfigForApples = {
            delay: 1000,
            callback: () => {
                this.apples.createRandom();
                const level = LevelManager.getLevel();
                this.time.addEvent({
                    callback: eventConfigForApples.callback,
                    delay: Phaser.Math.RND.integerInRange(level.appleFactoryDelayMin, level.appleFactoryDelayMax),
                });
            },
        };
        this.time.addEvent(eventConfigForApples);

        this.bullets = new BulletGroup(this.physics.world, this);
        this.shipBullets = new ShipBulletGroup(this.physics.world, this);
        this.ammo = new AmmoGroup(this.physics.world, this);
        this.explosions = new ExplosionGroup(this.physics.world, this);
        this.explosions2 = new ExplosionGroup2(this.physics.world, this);

        this.ships.target = this.player;
        this.ships.onFire = (ship) => {
            this.shipBullets.fireFrom(ship);
        };

        this.apples.lightSource = this.player;
        this.bullets.lightSource = this.player;
        this.shipBullets.lightSource = this.player;
        this.ammo.lightSource = this.player;
        this.ships.lightSource = this.player;

        const putAmmo = (ship) => {
            if (ship.bulletsCount) {
                this.ammo.putFrom(ship, ship.bulletsCount);
            }
        };

        this.physics.add.overlap(this.player, this.ships, (player, ship) => {
            if (player.active) {
                this.explosions2.bump(player, ship, { silent: true });
                putAmmo(ship);
                ship.blowUp(player);
                player.blowUp(ship);
                restartGame();
            }
        });

        this.physics.add.overlap([this.player, this.ships], this.ammo, (object1, object2) => {
            if (object1.active && object2.active) {
                const [ammo, ship] = this.ammo.contains(object1) ? [object1, object2] : [object2, object1];
                ship.collectAmmo(ammo.getData('count'));
                deactivate(ammo);
            }
        });

        this.physics.add.overlap(this.ships, this.ships, (ship1, ship2) => {
            if (ship1.active && ship2.active) {
                this.explosions.bump(ship1, ship2);
                this.player.changeShipsCount(+2);
                putAmmo(ship1);
                ship1.blowUp(ship2);
                putAmmo(ship2);
                ship2.blowUp(ship1);
            }
        });

        this.physics.add.overlap([this.bullets, this.shipBullets], this.ships, (object1, object2) => {
            if (object1.active && object2.active) {
                const [ship, bullet] = this.ships.contains(object1) ? [object1, object2] : [object2, object1];
                if (bullet.getData('owner') !== ship) {
                    if (ship.applesCount > 0) {
                        ship.hit(bullet);
                    } else {
                        this.explosions.blowUp(ship);
                        this.player.changeShipsCount(+1);
                        putAmmo(ship);
                        ship.blowUp(bullet);
                    }
                    deactivate(bullet);
                }
            }
        });

        this.physics.add.overlap(this.player, this.shipBullets, (player, bullet) => {
            if (bullet.active && player.active) {
                if (player.applesCount > 0) {
                    player.hit(bullet);
                } else {
                    this.explosions2.blowUp(player, { silent: true });
                    player.blowUp(bullet);
                    restartGame();
                }
                deactivate(bullet);
            }
        });

        this.physics.add.overlap(this.bullets, this.shipBullets, (bullet1, bullet2) => {
            if (bullet1.active && bullet2.active) {
                this.explosions.bump(bullet1, bullet2);
                deactivate(bullet1);
                deactivate(bullet2);
            }
        });

        this.physics.add.overlap([this.bullets, this.shipBullets], this.apples, (bullet, apple) => {
            if (bullet.active && apple.active) {
                this.explosions2.bump(bullet, apple);
                deactivate(bullet);
                deactivate(apple);
            }
        });

        this.physics.add.overlap([this.player, this.ships], this.apples, (ship, apple) => {
            if (ship.active) {
                ship.collectApple();
                deactivate(apple);
            }
        });

        this.cameras.main.fadeIn(1000);
    }

    update() {
        super.update.call(this, arguments);

        const totalLevels = LevelManager.getLevels().length;
        const level = LevelManager.getLevel();
        if (level.finished()) {
            console.log(`Level ${level.index} cleared!`);
            if (level.index + 1 < totalLevels) {
                LevelManager.setLevel(this, level.index + 1);
                this.player.updateLevel();
            } else {
                console.log('Game over!');
                LevelManager.setLevel(this, 0);
            }
        }
    }
}
