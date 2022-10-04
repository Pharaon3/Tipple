import React from 'react';
import styles from './PrivacyPolicy.module.scss';
import { useSelector } from 'react-redux';
// import Markdown from 'markdown-to-jsx';

const PrivacyPolicy = ({ section }) => {
  const theme = useSelector((store) => store.theme);
  const content = theme.disclaimers[section] || '';

  return (
    <div className={styles.privacy}>
      <p className={styles.grey}>
        By shopping with Tipple you agree you are over 18 years of age, have
        valid ID on delivery and agree to Tipple’s{' '}
        <a
          href="/content/terms-and-conditions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms and Conditions
        </a>
        . Learn more about how Tipple looks after your data in our{' '}
        <a
          href="/content/data-collection-notice"
          target="_blank"
          rel="noopener noreferrer"
        >
          Data Collection notice
        </a>
        . <br />
        {/* <Markdown>{content}</Markdown> */}
      </p>
    </div>
  );
};

export default PrivacyPolicy;
