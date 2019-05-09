import Phaser from 'phaser';

function preload() {
    this.load.image('hero', 'src/assets/space_ship.png');
    this.load.image('sky', 'src/assets/navy-star-wallpaper.jpg');
    this.load.spritesheet('pasha', 'src/assets/starblast_ship_gray.png', { frameWidth: 28, frameHeight: 14 });
    this.load.spritesheet('boom', 'src/assets/blast-vector-gif-animation-16.png', {
        frameWidth: 400,
        frameHeight: 288,
    });
    this.load.audio('heroBoom', 'src/assets/heroBoom.wav', {
        instances: 1,
    });
    this.load.audio('shipBoom', 'src/assets/shipBoom.wav', {
        instances: 3,
    });
}

function create() {
    this.player = this.add.image(400, 300, 'sky');
    this.player = this.physics.add.image(400, 300, 'hero');
    this.player.setCollideWorldBounds(true);

    this.ships = this.physics.add.group();
    this.time.addEvent({
        delay: 1000,
        callback() {
            const ship = new Phaser.GameObjects.Sprite(this, 50 + Math.random() * 700, -50, 'pasha');
            this.add.existing(ship);
            ship.setRotation(Math.PI);
            ship.anims.play('pasha_fire');
            this.ships.add(ship);
            ship.setScale(2);
            ship.body.velocity.y = 100 + Math.random() * 200;
        },
        callbackScope: this,
        loop: true,
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
        }
    });

    this.anims.create({
        key: 'pasha_fire',
        frames: this.anims.generateFrameNumbers('pasha', { start: 0, end: 2 }),
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
}

const velocityStep = 10;
const maxVelocity = velocityStep * 30;

function update() {
    if (this.cursors.left.isDown) {
        this.player.body.velocity.x = Math.max(this.player.body.velocity.x - velocityStep, -maxVelocity);
    } else if (this.cursors.right.isDown) {
        this.player.body.velocity.x = Math.min(this.player.body.velocity.x + velocityStep, maxVelocity);
    } else if (this.player.body.velocity.x) {
        this.player.body.velocity.x += velocityStep * 0.5 * (this.player.body.velocity.x > 0 ? -1 : 1);
    }

    if (this.cursors.up.isDown) {
        this.player.body.velocity.y = Math.max(this.player.body.velocity.y - velocityStep, -maxVelocity);
    } else if (this.cursors.down.isDown) {
        this.player.body.velocity.y = Math.min(this.player.body.velocity.y + velocityStep, maxVelocity);
    } else if (this.player.body.velocity.y) {
        this.player.body.velocity.y += velocityStep * 0.5 * (this.player.body.velocity.y > 0 ? -1 : 1);
    }

    this.ships.children.each((ship) => {
        if (ship.y > this.game.config.height + ship.displayHeight) {
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
            debug: true,
        },
        impact: {
            gravity: 50,
            maxVelocity: 800,
            debug: true,
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
