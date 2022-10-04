import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { logoutUser } from 'app/resources/action/Logout';
import { displayReferralCodePopup } from 'app/resources/action/DisplayReferralCode';

import styles from './PrimaryMenu.module.scss';

const PrimaryMenu = ({ history, user, cart }) => {
    const [isShowing, setIsShowing] = useState(false);
    const menuRef = useRef();
    const dispatch = useDispatch();
    const auth = useSelector(state => state?.auth);
    const referralsEnabled = useSelector(state => state?.theme?.referrals ?? false);

    const handleCancel = e => {
        if (menuRef?.current?.contains(e.target)) {
            return;
        }

        if (isShowing) {
            setIsShowing(false);
        }
    };

    const handleClick = (ev) => {
        setIsShowing(!isShowing);
    };

    const handleReferAFriend = e => {
        e.preventDefault();
        dispatch(displayReferralCodePopup());
    }

    const handleLogOut = () => {
        dispatch(logoutUser(history, auth));
    }

    const handleLogin = () => {
        history.push(`/user?redirect=${`${history?.location?.pathname}${encodeURIComponent(history?.location?.search)}`}`);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleCancel, false);

        return () => {
            document.removeEventListener('mousedown', handleCancel, false);
        };
    }, [isShowing]);

    return (
        <div className={styles.primary} ref={menuRef} onClick={handleClick}>
            <button className={classNames(styles.button, cart && 'large')}>
                <span className={styles.icon}>
                    <span className={styles.top}></span>
                    <span className={styles.mid}></span>
                    <span className={styles.bot}></span>
                </span>
            </button>
            {isShowing && <ul className={styles.menu}>
                {!user && <li onClick={handleLogin} className={styles.item}>
                    <span className="ui-menuitem-link ui-corner-all"><span className="ui-menuitem-text">Login</span></span>
                </li>}
                {user && referralsEnabled && <li onClick={handleReferAFriend} className={styles.item}>
                    <span className="ui-menuitem-link ui-corner-all"><span className="ui-menuitem-text">Refer a Friend</span></span>
                </li>}
                {user && <li onClick={handleLogOut} className={styles.item}>
                    <span className="ui-menuitem-link ui-corner-all"><span className="ui-menuitem-text">Log Out</span></span>
                </li>}
            </ul>}
        </div>
    );
};

export default PrimaryMenu;