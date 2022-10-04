import React from 'react';

// FIXME: This is fairly crude, but without re-architecting parts of the app and theme API it gets fonts loading later in the 
// page and not blocking the render.
const FontLoader = ({ siteId }) => {
    return (
        <>
            {(siteId === 1 || siteId === 2 || siteId === 3) && (
                <>
                    <link rel="preload" as="style" href="/static/assets/theme/default/fonts.css" />
                    <link rel="preload" as="font" href="/static/bootstrap/assets/fonts/greycliff/fonts/regular/greycliff-cf-regular.woff" type="font/woff2" crossOrigin="anonymous" />
                    <link rel="preload" as="font" href="/static/bootstrap/assets/fonts/greycliff/fonts/medium/greycliff-cf-medium.woff" type="font/woff2" crossOrigin="anonymous" />
                    <link rel="preload" as="font" href="/static/bootstrap/assets/fonts/greycliff/fonts/demi-bold/greycliff-cf-demi-bold.woff" type="font/woff2" crossOrigin="anonymous" />
                    <link rel="preload" as="font" href="/static/bootstrap/assets/fonts/greycliff/fonts/bold/greycliff-cf-bold.woff" type="font/woff2" crossOrigin="anonymous" />
                    <link href="/static/assets/theme/default/fonts.css" rel="stylesheet" />
                </>
            )}
            {siteId === 7 && (
                <>
                    <link rel="preload" as="style" href="/static/assets/theme/7eleven/fonts.css" />
                    <link href="/static/assets/theme/7eleven/fonts.css" rel="stylesheet" />
                </>
            )}
        </>
    );
};

export default FontLoader;