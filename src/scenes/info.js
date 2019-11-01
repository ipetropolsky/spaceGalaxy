import Phaser from 'phaser';

import makeFullScreenButton from 'src/fullscreen';
import {
    BULLETS_COUNT,
    APPLES_COUNT,
    SHIPS_COUNT,
    SHIP_APPLES_COUNT,
    SHIP_HERO_COUNT,
    GOAL,
    GOAL_APPLES,
    GOAL_SHIPS,
    GOAL_SECONDS,
} from 'src/registry';

export default class Info extends Phaser.Scene {
    constructor() {
        super('info');
    }

    preload() {
        this.load.image('rocketIcon', 'assets/rocket.png');
        this.load.spritesheet('shipIcon', 'assets/ship.png', { frameWidth: 28, frameHeight: 9 });
        this.load.spritesheet('heroIcon', 'assets/hero.png', { frameWidth: 23, frameHeight: 33 });
        this.load.spritesheet('fullscreen', 'assets/fullscreen.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('appleIcon', 'assets/apple.png');
        this.load.image('timeIcon', 'assets/hourglass.png');
    }

    create() {
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.scene.isPaused('main')) {
                this.scene.get('main').time.paused = true;
                this.scene.resume('main');
                this.scene.resume('sky');
            } else {
                // debugger;
                this.scene.get('main').time.paused = false;
                this.scene.pause('main');
                this.scene.pause('sky');
            }
        });

        const screenWidth = this.game.config.width;
        const screenHeight = this.game.config.height;

        this.images = {};
        this.texts = {};

        this.images[BULLETS_COUNT] = this.add.image(30, 26, 'rocketIcon');
        this.texts[BULLETS_COUNT] = this.add.text(45, 16, '0', { fontSize: '20px', fill: '#fff' });

        this.images[APPLES_COUNT] = this.add.image(100, 24, 'appleIcon');
        this.texts[APPLES_COUNT] = this.add.text(117, 16, '0', { fontSize: '20px', fill: '#fff' });

        this.images[SHIPS_COUNT] = this.add.image(165, 26, 'shipIcon');
        this.texts[SHIPS_COUNT] = this.add.text(185, 16, '0', { fontSize: '20px', fill: '#fff' });

        this.images[SHIP_HERO_COUNT] = this.add.image(screenWidth - 63, 26, 'heroIcon');
        this.texts[SHIP_HERO_COUNT] = this.add.text(screenWidth - 45, 16, '0', { fontSize: '20px', fill: '#fff' });

        this.images[SHIP_APPLES_COUNT] = this.add.image(screenWidth - 125, 24, 'appleIcon');
        this.texts[SHIP_APPLES_COUNT] = this.add.text(screenWidth - 108, 16, '0', { fontSize: '20px', fill: '#fff' });

        this.goals = {
            [GOAL_APPLES]: {
                image: this.add.image(30, screenHeight - 16, 'appleIcon'),
                text: this.add.text(47, screenHeight - 24, '', { fontSize: '20px', fill: '#fff' }),
            },
            [GOAL_SHIPS]: {
                image: this.add.image(27, screenHeight - 14, 'shipIcon'),
                text: this.add.text(47, screenHeight - 24, '', { fontSize: '20px', fill: '#fff' }),
            },
            [GOAL_SECONDS]: {
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
        if (key === GOAL) {
            this.goal = data;
            [GOAL_APPLES, GOAL_SHIPS, GOAL_SECONDS].forEach((type) => {
                this.goals[type].image.setVisible(type === data.type);
                this.goals[type].text.setVisible(type === data.type);
                this.goals[type].text.setText(data.param);
            });
        }
        if (key in this.goals) {
            this.goals[this.goal.type].text.setText(data);
        }
    };

    update() {
        // if (this.goal && this.goal.type === SECONDS) {
        //     const level = LevelManager.getLevel();
        //     this.goals[this.goal.type].text.setText(
        //         (this.goal.param - (this.scene.get('main').time.now - level.startTime) / 1000).toFixed(2)
        //     );
        // }
    }
}
