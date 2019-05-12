import Phaser from 'phaser';

import SceneBoot from './scenes/boot';
import SceneInfo from './scenes/info';
import SceneMain from './scenes/main';
import SceneSky from './scenes/sky';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    title: 'Space Face',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            // debug: true,
        },
    },
    pixelArt: true,
    roundPixels: true,
    scene: [SceneBoot, SceneSky, SceneMain, SceneInfo],
};

// eslint-disable-next-line no-unused-vars
new Phaser.Game(config);
