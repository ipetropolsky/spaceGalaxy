import Phaser from 'phaser';

import AmmoGroup from '../ammo';
import BulletGroup from '../bullets';
import ExplosionGroup from '../explosions';
import Player from '../player';
import ShipBulletGroup from '../shipBullets';
import ShipGroup from '../ships';
import { deactivate } from '../utils';
import LevelManager from '../levelManager';

export default class Main extends Phaser.Scene {
    constructor() {
        super('main');
    }

    preload() {
        this.load.image('apple', 'src/assets/apple.png');
        this.load.image('hero', 'src/assets/hero.png');
        this.load.image('rocket', 'src/assets/rocket.png');
        this.load.spritesheet('ship', 'src/assets/ship.png', { frameWidth: 28, frameHeight: 14 });
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
        this.load.audio('collectRetro', 'src/assets/collectRetro.mp3', {
            instances: 3,
        });
        this.load.audio('collectLovely', 'src/assets/collectLovely.mp3', {
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
                        delay: 50,
                        callback: () => {
                            this.player.changeApplesCount(-1);
                        },
                        repeat: this.player.applesCount - 1,
                    });
                }, 2000 - 51 * this.player.applesCount);
            }
        };

        this.anims.create({
            key: 'shipFire',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: Infinity,
        });

        this.anims.create({
            key: 'shipWithAmmoFire',
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
            key: 'shipWithAmmoRainbowFire',
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

        this.ships.target = this.player;
        this.ships.onFire = (ship) => {
            this.shipBullets.fireFrom(ship);
        };

        const destroyShip = (ship) => {
            const level = LevelManager.getLevel();
            if (level.shipThrowsAmmo && ship.getData('charged')) {
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
                restartGame();
            }
        });

        this.physics.add.overlap(this.bullets, this.shipBullets, (bullet1, bullet2) => {
            if (bullet1.active && bullet2.active) {
                this.explosions.bump(bullet1, bullet2);
                deactivate(bullet1);
                deactivate(bullet2);
            }
        });

        const apples = this.physics.add.group();
        const eventConfigForApples = {
            delay: 1000,
            callback: () => {
                const apple = this.physics.add.sprite(Phaser.Math.RND.between(50, 750), -20, 'apple');
                apple.setScale(1.5);
                apple.setRotation((Phaser.Math.RND.between(-30, 30) * Math.PI) / 180);
                apples.add(apple, true);
                apple.setAngularVelocity(Phaser.Math.RND.between(80, 120));
                apple.body.velocity.y = Phaser.Math.RND.between(100, 300);
                this.time.addEvent({
                    callback: eventConfigForApples.callback,
                    delay: Phaser.Math.RND.integerInRange(2000, 3000),
                });
            },
        };
        this.time.addEvent(eventConfigForApples);

        this.physics.add.overlap([this.player, this.ships], apples, (ship, apple) => {
            if (this.ships.contains(ship)) {
                this.sound.play('collectLovely', { volume: 0.2 });
                ship.anims.play(ship.getData('charged') ? 'shipWithAmmoRainbowFire' : 'shipRainbowFire');
            } else {
                this.sound.play('collectRetro', { volume: 0.4 });
                ship.changeApplesCount(+1);
            }
            apple.destroy();
        });

        this.cameras.main.fadeIn(1000);
    }
}
