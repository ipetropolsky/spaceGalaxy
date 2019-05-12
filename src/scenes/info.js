import Phaser from 'phaser';

export const BULLETS_COUNT = 'bulletsCount';
export const SHIPS_COUNT = 'shipsCount';

export default class Info extends Phaser.Scene {
    constructor() {
        super('info');
    }

    preload() {
        this.load.image('rocketIcon', 'src/assets/rocket.png');
        this.load.spritesheet('shipIcon', 'src/assets/ship.png', { frameWidth: 28, frameHeight: 14 });
    }

    create() {
        this.add.image(30, 26, 'rocketIcon');
        this.bulletsText = this.add.text(45, 16, '', { fontSize: '20px', fill: '#fff' });

        this.add.image(this.game.config.width - 65, 26, 'shipIcon');
        this.shipsText = this.add.text(this.game.config.width - 45, 16, '', { fontSize: '20px', fill: '#fff' });

        this.registry.events.on('changedata', this.updateData);
        this.registry.events.on('setdata', this.updateData);
    }

    updateData = (parent, key, data) => {
        switch (key) {
            case BULLETS_COUNT:
                this.bulletsText.setText(data);
                break;
            case SHIPS_COUNT:
                this.shipsText.setText(data);
                break;
        }
    };
}
