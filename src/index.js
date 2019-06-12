import Phaser from 'phaser';

import SceneBoot from 'src/scenes/boot';
import SceneInfo from 'src/scenes/info';
import SceneMain from 'src/scenes/main';
import SceneSky from 'src/scenes/sky';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    title: 'Space Face',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            // debug: true,
        },
    },
    pixelArt: true,
    // roundPixels: true,
    scene: [SceneBoot, SceneSky, SceneMain, SceneInfo],
};

// eslint-disable-next-line no-unused-vars
new Phaser.Game(config);
