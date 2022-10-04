import React from 'react';
import styles from "./NavigationContainer.module.scss";
import { useHistory } from 'react-router-dom';

const NavigationContainer = props => {

    const history = useHistory();

    const handleBackClick = ( ) => {
        //TODO
        console.log("back click");
        history.goBack();
    }
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <button className={styles.back} onClick={handleBackClick}>
                    <i className="fa fa-chevron-left" />
                </button>
                { props.children }
            </div>
        </div>
    );
};

NavigationContainer.propTypes = {

};

export default NavigationContainer;
