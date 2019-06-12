import Level1 from 'src/levels/level1';
import Level2, { Level2Dark } from 'src/levels/level2';
import Level3, { Level3Dark } from 'src/levels/level3';
import Level4, { Level4Dark } from 'src/levels/level4';
import { APPLES_COUNT, SHIPS_COUNT } from 'src/scenes/info';

const LevelManager = (function() {
    const levels = [Level1, Level2, Level2Dark, Level3, Level3Dark, Level4, Level4Dark];
    let currentLevel;

    const setLevel = (scene, index, forceReset) => {
        console.log('setLevel', index);
        if (typeof index !== 'number' || index < 0 || index >= levels.length) {
            throw new Error(`Invalid level: ${index}`);
        }
        const startTime = scene.time.now;
        const startApples = (forceReset ? 0 : scene.registry.get(APPLES_COUNT)) || 0;
        const startShips = (forceReset ? 0 : scene.registry.get(SHIPS_COUNT)) || 0;
        currentLevel = {
            ...levels[index],
            index,
            scene,
            startTime,
            startApples,
            startShips,
        };
        currentLevel.onStart && currentLevel.onStart();
        console.log(`New level ${currentLevel.index} at ${currentLevel.startTime}`);
        console.log(`Goal: ${currentLevel.goalParam} ${currentLevel.goalType}!`);
        scene.registry.set('goal', { type: currentLevel.goalType, param: currentLevel.goalParam });
    };

    return {
        getLevels: () => levels,
        getLevel: () => currentLevel,
        setLevel,
    };
})();

export default LevelManager;
