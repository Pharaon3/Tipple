import React from 'react';
import { Link } from 'react-router-dom';

const TermsCheckbox = () => {
    return (
        <>
            I accept the <Link to={`/content/terms-and-conditions`} target="_blank">Terms and Conditions</Link>. I understand that this site is operated by Tipple and not 7-Eleven, and goods will be sold to me by Tipple.
        </>
    );
};

export default TermsCheckbox;