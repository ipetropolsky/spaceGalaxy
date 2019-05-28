import Default from './levels/default';
import Level1, { Level1Dark } from './levels/level1';
import Level2, { Level2Dark } from './levels/level2';
import Level3, { Level3Dark } from './levels/level3';
import Level4, { Level4Dark } from './levels/level4';
import { APPLES_COUNT, SHIPS_COUNT } from './scenes/info';

const LevelManager = (function() {
    const levels = [Level1, Level1Dark, Level2, Level2Dark, Level3, Level3Dark, Level4, Level4Dark];
    let currentLevel;

    const setLevel = (scene, index, forceReset) => {
        const isValidIndex = typeof index === 'number' && 0 <= index && index < levels.length;
        if (isValidIndex && (!currentLevel || index !== currentLevel.index || forceReset)) {
            const startTime = scene.time.now;
            const startApples = scene.registry.get(APPLES_COUNT) || 0;
            const startShips = scene.registry.get(SHIPS_COUNT) || 0;
            currentLevel = {
                ...(isValidIndex ? levels[index] : Default),
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
        }
    };

    return {
        getLevels: () => levels,
        getLevel: () => currentLevel,
        setLevel,
    };
})();

export default LevelManager;
