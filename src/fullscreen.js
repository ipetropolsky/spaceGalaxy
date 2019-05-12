/**
 * Сделать спрайт кнопкой включения полноэкранного режима.
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.Sprite} gameObject
 * @param {Object} [params]
 * @param {Function} [params.onPointerOver]
 * @param {Function} [params.onPointerOut]
 * @returns {Function} Функция удаления навешенных событий.
 */
export default function makeFullScreenButton(scene, gameObject, params) {
    const { onPointerOver, onPointerOut } = params;
    const onEnterFullScreen = () => {
        gameObject.setFrame(1);
    };
    const onLeaveFullScreen = () => {
        gameObject.setFrame(0);
    };
    const onPointerUp = () => {
        if (scene.scale.isFullscreen) {
            scene.scale.stopFullscreen();
        } else {
            scene.scale.startFullscreen();
        }
    };

    onPointerOver && gameObject.on('pointerover', onPointerOver);
    onPointerOut && gameObject.on('pointerout', onPointerOut);
    gameObject.on('pointerup', onPointerUp);
    scene.scale.on('enterfullscreen', onEnterFullScreen);
    scene.scale.on('leavefullscreen', onLeaveFullScreen);

    return () => {
        onPointerOver && gameObject.off('pointerover', onPointerOver);
        onPointerOut && gameObject.off('pointerout', onPointerOut);
        gameObject.off('pointerup', onPointerUp);
        scene.scale.off('enterfullscreen', onEnterFullScreen);
        scene.scale.off('leavefullscreen', onLeaveFullScreen);
    };
}
