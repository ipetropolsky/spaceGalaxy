import Level1 from './levels/level1';
import Level2 from './levels/level2';
import Level3 from './levels/level3';
import Level4 from './levels/level4';

const LevelManager = (function() {
    const levels = [Level1, Level2, Level3, Level4];
    let currentLevel = 0;

    return {
        getIndex: () => currentLevel,
        getLevel: () => levels[currentLevel],
        setLevel: (index) => {
            console.log('setLevel ' + index);
            currentLevel = index;
        },
        nextLevel: () => {
            currentLevel = Math.min(currentLevel + 1, levels.length - 1);
        },
        prevLevel: () => {
            currentLevel = Math.max(currentLevel - 1, 0);
        },
    };
})();

export default LevelManager;
