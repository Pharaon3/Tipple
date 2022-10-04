import React from 'react';
import { Link } from 'react-router-dom';

const TermsCheckbox = () => {
    return (
        <>
            I accept the <Link to={`/content/terms-and-conditions`} target="_blank">Terms and Conditions</Link>
        </>
    );
};

export default TermsCheckbox;