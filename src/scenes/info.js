import Phaser from 'phaser';

import makeFullScreenButton from '../fullscreen';

export const BULLETS_COUNT = 'bulletsCount';
export const SHIPS_COUNT = 'shipsCount';
export const APPLES_COUNT = 'applesCount';

export default class Info extends Phaser.Scene {
    constructor() {
        super('info');
    }

    preload() {
        this.load.image('rocketIcon', 'src/assets/rocket.png');
        this.load.spritesheet('shipIcon', 'src/assets/ship.png', { frameWidth: 28, frameHeight: 14 });
        this.load.spritesheet('fullscreen', 'src/assets/fullscreen.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('appleIcon', 'src/assets/apple.png');
    }

    create() {
        const screenWidth = this.game.config.width;
        const screenHeight = this.game.config.height;

        this.images = {};
        this.texts = {};

        this.images[BULLETS_COUNT] = this.add.image(30, 26, 'rocketIcon');
        this.texts[BULLETS_COUNT] = this.add.text(45, 16, '', { fontSize: '20px', fill: '#fff' });

        this.images[SHIPS_COUNT] = this.add.image(screenWidth - 65, 26, 'shipIcon');
        this.texts[SHIPS_COUNT] = this.add.text(screenWidth - 45, 16, '', { fontSize: '20px', fill: '#fff' });

        this.images[APPLES_COUNT] = this.add.image(125, 24, 'appleIcon');
        this.texts[APPLES_COUNT] = this.add.text(142, 16, '0', { fontSize: '20px', fill: '#fff' });

        this.registry.events.on('changedata', this.updateData);
        this.registry.events.on('setdata', this.updateData);

        const fullscreen = this.add.image(screenWidth - 37, screenHeight - 30, 'fullscreen').setInteractive();
        fullscreen.alpha = 0.5;
        makeFullScreenButton(this, fullscreen, {
            onPointerOver: () => {
                fullscreen.alpha = 1;
            },
            onPointerOut: () => {
                fullscreen.alpha = 0.5;
            },
        });

        this.textTweens = {};
        [BULLETS_COUNT, SHIPS_COUNT, APPLES_COUNT].forEach((key) => {
            this.textTweens[key] = this.tweens.add({
                targets: this.images[key],
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 100,
                ease: 'Power2',
                yoyo: true,
            });
        });
    }

    animateCounter = (key) => {
        if (key in this.texts) {
            const tween = this.textTweens[key];
            tween.restart();
        }
    };

    updateData = (parent, key, data) => {
        if (key in this.texts) {
            const target = this.texts[key];
            target.setText(data);
        }
    };
}
