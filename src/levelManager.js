import Level1 from './levels/level1';

const LevelManager = (function() {
    const levels = [new Level1()];
    let currentLevel = 0;

    return {
        getIndex: () => currentLevel,
        getLevel: () => levels[currentLevel],
        setLevel: (index) => {
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
