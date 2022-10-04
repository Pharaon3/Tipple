export const BREAKPOINTS = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
};

export const getProductGridColumns = windowWidth => {
    // Mobile first default, xs breakpoint
    let cols = 2;

    if (windowWidth >= BREAKPOINTS.sm && windowWidth <= BREAKPOINTS.md - 1) {
        cols = 2;
    } else if (windowWidth >= BREAKPOINTS.md && windowWidth <= BREAKPOINTS.lg - 1) {
        cols = 3;
    } else if (windowWidth >= BREAKPOINTS.lg && windowWidth <= BREAKPOINTS.xl - 1) {
        cols = 4;
    } else if (windowWidth >= BREAKPOINTS.xl) {
        cols = 5; //newProductCards ? 5 : 4;
    }

    return cols;
};

export const getProductCardHeight = (windowWidth, padding = 0) => {
    // Mobile first default, xs breakpoint
    let height = 254;

    if (windowWidth >= BREAKPOINTS.sm && windowWidth <= BREAKPOINTS.md - 1) {
        height = 295;
    } else if (windowWidth >= BREAKPOINTS.md && windowWidth <= BREAKPOINTS.lg - 1) {
        height = 340;
    } else if (windowWidth >= BREAKPOINTS.lg && windowWidth <= BREAKPOINTS.xl - 1) {
        height = 379;
    } else if (windowWidth >= BREAKPOINTS.xl) {
        height = 379;
    }

    return height + padding;
};

export default {
    BREAKPOINTS,
    getProductGridColumns
};
