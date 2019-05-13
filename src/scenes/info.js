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
        this.load.image('coin', 'src/assets/apple.png');
    }

    create() {
        const screenWidth = this.game.config.width;
        const screenHeight = this.game.config.height;

        this.add.image(30, 26, 'rocketIcon');
        this.bulletsText = this.add.text(45, 16, '', { fontSize: '20px', fill: '#fff' });

        this.add.image(screenWidth - 65, 26, 'shipIcon');
        this.shipsText = this.add.text(screenWidth - 45, 16, '', { fontSize: '20px', fill: '#fff' });

        this.add.image(125, 24, 'coin');
        this.applesText = this.add.text(142, 16, '0', { fontSize: '20px', fill: '#fff' });

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
    }

    updateData = (parent, key, data) => {
        switch (key) {
            case BULLETS_COUNT:
                this.bulletsText.setText(data);
                break;
            case SHIPS_COUNT:
                this.shipsText.setText(data);
                break;
            case APPLES_COUNT:
                this.applesText.setText(data);
                break;
        }
    };
}
