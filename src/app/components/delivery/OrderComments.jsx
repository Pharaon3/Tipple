import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { MAX_ORDER_COMMENT_LENGTH } from 'lib/constants/app';

import styles from './OrderComments.module.scss';

const OrderComments = ({ comment, hasError = false, onChangeComment }) => {
    const [expanded, setExpanded] = useState(false);
    let orderCommentEl;

    const ocTextAreaAdjust = () => {
        orderCommentEl.style.height = 'auto';
        orderCommentEl.style.height = orderCommentEl.scrollHeight + 'px';
    };

    const handleCommentChange = e => {
        onChangeComment(e?.target?.value);
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (expanded === true) {
            setTimeout(() => {
                if (orderCommentEl) {
                    ocTextAreaAdjust();
                    orderCommentEl.focus();
                }
            }, 50);
        }
    }, [expanded]);

    return (
        <div className={classNames(styles.comments, 'form-material')}>
            <div onClick={toggleExpanded} className={styles.head}>
                <label htmlFor="showComment">Order Comments</label>
                <small className={styles.hint}>Add any comments to help with delivery.</small>
                <span className={classNames(styles.toggle, expanded && styles.expanded)}><i className="fa fa-caret-up"></i></span>
            </div>
            {expanded && <div className={classNames(styles.textarea, 'field')}>
                <textarea
                    ref={ref => orderCommentEl = ref}
                    rows="1"
                    onKeyUp={ocTextAreaAdjust}
                    style={{ overflow: "hidden" }}
                    name="comment"
                    id="comment"
                    defaultValue={comment}
                    onChange={handleCommentChange}
                    className={hasError ? 'ng-invalid error' : 'ng-valid'}
                />
                <div className={styles.footer}>
                    <div className={styles.error}>
                        {hasError && <div className="field error-message">Comment length is too long<div className="fa fa-exclamation-triangle pull-left"></div></div>}
                    </div>
                    <span className={styles.counter}>{comment?.length}/{MAX_ORDER_COMMENT_LENGTH}</span>
                </div>
            </div>}
        </div>
    );
};

export default OrderComments;