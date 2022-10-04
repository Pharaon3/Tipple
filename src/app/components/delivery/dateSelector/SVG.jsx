import * as React from 'react';

const SVG = ({
    svgString
}) => {
    const dataUrl = `url('data:image/svg+xml;base64,${btoa(svgString)}')`;

    return (<div style={{
            backgroundImage: dataUrl,
            backgroundSize: '100%'
        }}
        className="icon">
        
    </div>
    );
};

export default SVG;