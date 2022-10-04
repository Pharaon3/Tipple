import React from 'react';
import classNames from 'classnames';

import styles from './SurveyPrompt.module.scss';

const SurveyPrompt = ({ surveyUrl, handleNoClick, handleYesClick, promptText }) => {
    return (
        <div className={styles.survey}>
            <div className={styles.header}><i class="material-icons thumb_up">&#xe8dc;</i></div>
            <p>{promptText}</p>
            <div className={styles.actions}>
                <button className={styles.link} onClick={handleNoClick}>Not Now</button>
                <a href={surveyUrl} target="_blank" className={classNames(styles.link, styles.cta)} onClick={handleYesClick}>Give Feedback</a>
            </div>
        </div>
    );
};

export default SurveyPrompt;