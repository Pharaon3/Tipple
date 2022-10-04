const renders = {};

export const countRender = componentName => {
    if (!renders[componentName]) {
        renders[componentName] = 1;
    } else {
        renders[componentName]++;
    }

    return renders[componentName];
};

export const getRenderCount = componentName => renders[componentName];

export default {
    countRender,
    getRenderCount
};