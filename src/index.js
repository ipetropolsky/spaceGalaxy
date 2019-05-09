import Phaser from 'phaser';

const Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize: function Bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'rocketShot');
        this.speed = Phaser.Math.GetSpeed(400, 1);
    },

    fire(x, y, vx, vy) {
        this.setPosition(x, y);

        this.body.velocity.x = vx;
        this.body.velocity.y = vy;

        this.setActive(true);
        this.setVisible(true);
    },

    update(time, delta) {
        this.y -= this.speed * delta;

        if (this.y < -this.displayHeight) {
            this.deactivate();
        }
    },

    deactivate() {
        this.setPosition(-100, -100);

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        this.setActive(false);
        this.setVisible(false);
    },
});

function preload() {
    this.load.image('hero', 'src/assets/space_ship.png');
    this.load.image('sky', 'src/assets/sky23.png');
    this.load.image('rocketShot', 'src/assets/rocketShot.png');
    this.load.spritesheet('ship', 'src/assets/starblast_ship_gray.png', { frameWidth: 28, frameHeight: 14 });
    this.load.spritesheet('boom', 'src/assets/blast-vector-gif-animation-16.png', {
        frameWidth: 400,
        frameHeight: 288,
    });
    this.load.audio('heroBoom', 'src/assets/heroBoom.mp3', {
        instances: 1,
    });
    this.load.audio('shipBoom', 'src/assets/shipBoom.mp3', {
        instances: 3,
    });
    this.load.audio('heroShot', 'src/assets/laser1.mp3', {
        instances: 5,
    });
    this.load.audio('heroBulletsEmpty', 'src/assets/heroBulletsEmpty.mp3', {
        instances: 3,
    });
    this.load.audio('missile', 'src/assets/missile.mp3', {
        instances: 3,
    });
}

const INITIAL_BULLETS_COUNT = 10;
const BULLETS_BONUS = 2;
const MIN_SHIP_SPEED = 100;
const MAX_SHIP_SPEED = 300;
const speedMultiplier = 1;
const sceneSpeed = 0;

function create() {
    this.sky = this.add.tileSprite(400, 300, 1920, 2156, 'sky');
    this.sky.setScale(0.42);

    this.player = this.physics.add.image(400, 300, 'hero');
    this.player.setCollideWorldBounds(true);

    this.add.image(30, 26, 'rocketShot');
    this.add.image(this.game.config.width - 65, 26, 'ship');

    this.shipsCount = 0;
    this.shipsText = this.add.text(this.game.config.width - 45, 16, '', { fontSize: '20px', fill: '#fff' });

    this.bulletsCount = INITIAL_BULLETS_COUNT;
    this.bulletsText = this.add.text(45, 16, '', { fontSize: '20px', fill: '#fff' });

    this.ships = this.physics.add.group();
    this.newShipEvent = this.time.addEvent({
        delay: 1000,
        callback() {
            const ship = new Phaser.GameObjects.Sprite(this, 50 + Math.random() * 700, -50, 'ship');
            this.add.existing(ship);
            ship.setRotation(Math.PI);
            ship.anims.play('ship_fire');
            this.ships.add(ship);
            ship.setScale(2);
            const speed = Math.random();
            ship.body.velocity.y = (MIN_SHIP_SPEED + speed * (MAX_SHIP_SPEED - MIN_SHIP_SPEED)) * speedMultiplier;
            ship.setData('speed', speed);
        },
        callbackScope: this,
        loop: true,
    });

    this.bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 30,
        runChildUpdate: true,
    });

    this.physics.add.overlap(this.player, this.ships, (player, ship) => {
        if (player.visible) {
            ship.setVisible(false);
            player.setVisible(false);
            const boom = new Phaser.GameObjects.Sprite(this, player.x, player.y, 'boom');
            this.add.existing(boom);
            boom.anims.play('boom');
            this.sound.play('heroBoom', { volume: 0.5 });
            ship.destroy();
        }
    });

    this.physics.add.overlap(this.ships, this.ships, (ship1, ship2) => {
        if (ship1.visible) {
            ship1.setVisible(false);
            ship2.setVisible(false);
            const boom = new Phaser.GameObjects.Sprite(this, (ship1.x + ship2.x) / 2, (ship1.y + ship2.y) / 2, 'boom');
            this.add.existing(boom);
            boom.anims.play('boom');
            this.sound.play('shipBoom', { volume: 0.5 });
            ship1.destroy();
            ship2.destroy();

            this.bulletsCount += BULLETS_BONUS;
            this.shipsCount += 2;
        }
    });

    this.physics.add.overlap(this.bullets, this.ships, (bullet, ship) => {
        if (bullet.active && ship.visible) {
            ship.setVisible(false);
            bullet.deactivate();
            ship.destroy();

            const boom = new Phaser.GameObjects.Sprite(this, ship.x, ship.y, 'boom');
            this.add.existing(boom);
            boom.anims.play('boom');
            this.sound.play('shipBoom', { volume: 0.5 });

            this.bulletsCount += BULLETS_BONUS;
            this.shipsCount += 1;
        }
    });

    this.anims.create({
        key: 'ship_fire',
        frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: Infinity,
    });

    this.anims.create({
        key: 'boom',
        frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 17 }),
        frameRate: 40,
        repeat: 0,
    });

    this.cameras.main.setBounds(0, 0, 400, 300);

    this.player.setScale(2, 2);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

const velocityStep = 10;
const maxVelocity = velocityStep * 30;
const bulletVelocityStep = 3;

function update() {
    this.sky.tilePositionY -= sceneSpeed;

    if (this.cursors.left.isDown) {
        this.player.body.velocity.x = Math.max(
            this.player.body.velocity.x - velocityStep * speedMultiplier,
            -maxVelocity * speedMultiplier
        );
    } else if (this.cursors.right.isDown) {
        this.player.body.velocity.x = Math.min(
            this.player.body.velocity.x + velocityStep * speedMultiplier,
            maxVelocity * speedMultiplier
        );
    } else if (this.player.body.velocity.x) {
        this.player.body.velocity.x +=
            velocityStep * speedMultiplier * 0.5 * (this.player.body.velocity.x > 0 ? -1 : 1);
    }

    if (this.cursors.up.isDown) {
        this.player.body.velocity.y = Math.max(
            this.player.body.velocity.y - velocityStep * speedMultiplier,
            -maxVelocity * speedMultiplier
        );
    } else if (this.cursors.down.isDown) {
        this.player.body.velocity.y = Math.min(
            this.player.body.velocity.y + velocityStep * speedMultiplier,
            maxVelocity * speedMultiplier
        );
    } else if (this.player.body.velocity.y) {
        this.player.body.velocity.y +=
            velocityStep * speedMultiplier * 0.5 * (this.player.body.velocity.y > 0 ? -1 : 1);
    }

    if (this.player.visible && Phaser.Input.Keyboard.JustDown(this.spacebar)) {
        if (this.bulletsCount) {
            this.sound.play('heroShot', { volume: 0.2 });
            const bullet = this.bullets.get();

            if (bullet) {
                bullet.fire(this.player.x, this.player.y, this.player.body.velocity.x, this.player.body.velocity.y);
                this.bulletsCount -= 1;
            }
        } else {
            this.sound.play('heroBulletsEmpty', { volume: 0.5 });
        }
    }

    this.bulletsText.setText(`${this.bulletsCount}`);
    this.shipsText.setText(`${this.shipsCount}`);

    this.bullets.children.each((bullet) => {
        if (bullet.active) {
            bullet.body.velocity.x += bulletVelocityStep * speedMultiplier * (bullet.body.velocity.x > 0 ? -1 : 1);
            bullet.body.velocity.y += bulletVelocityStep * speedMultiplier * (bullet.body.velocity.y > 0 ? -1 : 1);
        }
    });

    this.ships.children.each((ship) => {
        if (ship.y - ship.displayHeight / 2 > this.game.config.height) {
            this.sound.play('missile', { volume: 0.4 + 0.6 * ship.getData('speed') });
            ship.destroy();
        }
    });
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            // debug: true,
        },
        impact: {
            gravity: 50,
            maxVelocity: 800,
            // debug: true,
        },
    },
    pixelArt: true,
    roundPixels: true,
    scene: {
        preload,
        create,
        update,
    },
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
