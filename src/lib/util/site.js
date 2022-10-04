
// By which we mean, categories page. The 'home page' on web (/) is really the landing page the way it is named now.
export const isHomePage = (storePath, pathname) => {
    const reg = new RegExp(`${storePath}\/[A-Za-z\-]+\/[A-Za-z\-]+\/categories`, 'gi');
    return reg.test(pathname);
};

export default {
    isHomePage
};