import Phaser from 'phaser';

import makeFullScreenButton from '../fullscreen';
import { APPLES, SHIPS, SECONDS } from '../levels/goals';
import LevelManager from '../levelManager';

export const BULLETS_COUNT = 'bulletsCount';
export const SHIPS_COUNT = 'shipsCount';
export const APPLES_COUNT = 'applesCount';

export const SHIP_HERO_COUNT = 'shipHeroCount';
export const SHIP_APPLES_COUNT = 'shipApplesCount';

export default class Info extends Phaser.Scene {
    constructor() {
        super('info');
    }

    preload() {
        this.load.image('rocketIcon', 'src/assets/rocket.png');
        this.load.spritesheet('shipIcon', 'src/assets/ship.png', { frameWidth: 28, frameHeight: 9 });
        this.load.spritesheet('heroIcon', 'src/assets/hero.png', { frameWidth: 23, frameHeight: 33 });
        this.load.spritesheet('fullscreen', 'src/assets/fullscreen.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('appleIcon', 'src/assets/apple.png');
        this.load.image('timeIcon', 'src/assets/hourglass.png');
    }

    create() {
        const screenWidth = this.game.config.width;
        const screenHeight = this.game.config.height;

        this.images = {};
        this.texts = {};

        this.images[BULLETS_COUNT] = this.add.image(30, 26, 'rocketIcon');
        this.texts[BULLETS_COUNT] = this.add.text(45, 16, '', { fontSize: '20px', fill: '#fff' });

        this.images[APPLES_COUNT] = this.add.image(100, 24, 'appleIcon');
        this.texts[APPLES_COUNT] = this.add.text(117, 16, '0', { fontSize: '20px', fill: '#fff' });

        this.images[SHIPS_COUNT] = this.add.image(165, 26, 'shipIcon');
        this.texts[SHIPS_COUNT] = this.add.text(185, 16, '', { fontSize: '20px', fill: '#fff' });

        this.images[SHIP_HERO_COUNT] = this.add.image(screenWidth - 63, 26, 'heroIcon');
        this.texts[SHIP_HERO_COUNT] = this.add.text(screenWidth - 45, 16, '', { fontSize: '20px', fill: '#fff' });

        this.images[SHIP_APPLES_COUNT] = this.add.image(screenWidth - 125, 24, 'appleIcon');
        this.texts[SHIP_APPLES_COUNT] = this.add.text(screenWidth - 108, 16, '', { fontSize: '20px', fill: '#fff' });

        this.goals = {
            APPLES: {
                image: this.add.image(30, screenHeight - 16, 'appleIcon'),
                text: this.add.text(47, screenHeight - 24, '', { fontSize: '20px', fill: '#fff' }),
            },
            SHIPS: {
                image: this.add.image(27, screenHeight - 14, 'shipIcon'),
                text: this.add.text(47, screenHeight - 24, '', { fontSize: '20px', fill: '#fff' }),
            },
            SECONDS: {
                image: this.add.image(32, screenHeight - 14, 'timeIcon'),
                text: this.add.text(47, screenHeight - 24, '', { fontSize: '20px', fill: '#fff' }),
            },
        };

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
        [BULLETS_COUNT, SHIPS_COUNT, APPLES_COUNT, SHIP_HERO_COUNT, SHIP_APPLES_COUNT].forEach((key) => {
            this.textTweens[key] = this.tweens.add({
                targets: this.images[key],
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 100,
                ease: 'Power2',
                yoyo: true,
            });
        });

        this.cameras.main.fadeIn(1000);
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
        if (key === 'goal') {
            this.goal = data;
            [APPLES, SHIPS, SECONDS].forEach((type) => {
                this.goals[type].image.setVisible(type === data.type);
                this.goals[type].text.setVisible(type === data.type);
                this.goals[type].text.setText(data.param);
            });
        }
    };

    update() {
        if (this.goal && this.goal.type === SECONDS) {
            const level = LevelManager.getLevel();
            this.goals[this.goal.type].text.setText(
                (this.goal.param - (this.scene.get('main').time.now - level.startTime) / 1000).toFixed(2)
            );
        }
    }
}
