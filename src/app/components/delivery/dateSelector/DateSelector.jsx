import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setDeliveryTime } from 'app/resources/action/Cart';
import Card from './Card';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

import styles from './DateSelector.module.scss';

class DateSelector extends PureComponent {

    state = {
        lastDeliveryMethod: null,
        lastDeliveryDate: null,
        lastDeliveryTime: null,
        deliveryMethod: null,
        deliveryDate: null,
        deliveryTime: null
    }

    static getDerivedStateFromProps(props, state) {

        let newState = {
            deliveryMethod: state.deliveryMethod,
            deliveryDate: state.deliveryDate,
            deliveryTime: state.deliveryTime
        }

        // Check if the server value has changed. If so, then update to server value
        if (state.lastDeliveryMethod !== props.deliveryMethodId || state.lastDeliveryDate !== props.deliveryDate || state.lastDeliveryTime !== props.deliveryTimeMinutes) {
            newState = {
                lastDeliveryMethod: props.deliveryMethodId,
                lastDeliveryDate: props.deliveryDate,
                lastDeliveryTime: props.deliveryTimeMinutes,
                deliveryMethod: props.deliveryMethodId,
                deliveryDate: props.deliveryDate,
                deliveryTime: props.deliveryTimeMinutes
            }
        }

        return newState;
    }

    handleSelectMethod = (id) => {

        const selectedDeliveryMethod = this.props.deliveryMethods.items.find(dm => {
            return dm.id === id;
        });

        let deliveryDay;

        let newState = {
            deliveryDate: null,
            deliveryTime: null,
            deliveryMethod: id
        };

        if (!selectedDeliveryMethod) {
            return;
        }

        if (selectedDeliveryMethod.days && selectedDeliveryMethod.days.length > 0) {
            if (selectedDeliveryMethod.days.length === 1 && selectedDeliveryMethod.days[0].isToday && selectedDeliveryMethod.days[0].hours?.length > 0) {
                newState.deliveryDate = selectedDeliveryMethod.days[0].date;

                if (selectedDeliveryMethod.id !== this.state.deliveryMethod) {
                    // Different delivery method, pick the first available time.
                    newState.deliveryTime = selectedDeliveryMethod.days[0].hours[0].minutes;
                } else {
                    // Otherwise leave it as is.
                    newState.deliveryTime = this.state.deliveryTime;
                }
            } else {
                if (selectedDeliveryMethod.days[0].hours && selectedDeliveryMethod.days[0].hours.length > 0) {
                    deliveryDay = selectedDeliveryMethod.days[0];
                } else {
                    // Find the first day with available times
                    deliveryDay = selectedDeliveryMethod.days.find(day => day.hours && day.hours.length > 0);
                }
                newState.deliveryDate = deliveryDay.date;
    
                if (selectedDeliveryMethod.deliveryType === 'ASAP') {
                    newState.deliveryTime = deliveryDay.hours[0].minutes;
                }
            }
        }

        this.props.onChange(newState.deliveryMethod, newState.deliveryDate, newState.deliveryTime);

        this.setState(() => (newState));
    }

    handleSelectDate = (date) => {
        this.props.onChange(this.state.deliveryMethod, date, null);

        this.setState({
            deliveryDate: date,
            deliveryTime: null
        });
    }

    handleSelectTime = (time) => {

        this.props.onChange(this.state.deliveryMethod, this.state.deliveryDate, time);

        this.setState({
            deliveryTime: time
        });
    }

    render() {
        const props = this.props;

        let deliveryMethods = props.deliveryMethods.items ? props.deliveryMethods.items.filter(dm => !(dm.status === 'UNAVAILABLE' && dm.unavailableState !== 'VISIBLE')) : null;

        if (!deliveryMethods) {
            return <div className={styles.loading}>Loading...</div>;
        }

        const cardSize = deliveryMethods.length > 5 ? 'sm' : deliveryMethods.length > 3 ? 'md' : 'lg';

        const selectedDeliveryMethod = deliveryMethods.find(dm => {
            return dm.id === this.state.deliveryMethod;
        });

        let days = [];
        let times = [];

        let deliveryDate = null;

        selectedDeliveryMethod && selectedDeliveryMethod.deliveryType === 'FUTURE' && selectedDeliveryMethod.days && selectedDeliveryMethod.days.forEach(day => {
            if (this.state.deliveryDate === day.date) {
                day.hours.forEach(h => {
                    times.push({
                        value: h.minutes,
                        label: h.label
                    });
                });

                if (days.hours && days.hours.length > 0) {
                    deliveryDate = this.state.deliveryDate;
                }
            }

            days.push({
                value: day.date,
                label: day.label,
                disabled: !(day.hours && day.hours.length > 0)
            });

            // set selected delivery date to first valid day
            if (deliveryDate === null && day.hours && day.hours.length > 0) {
                deliveryDate = day.date;
            }
        });

        const areTdmsRevealed = props.clickToReveal && !selectedDeliveryMethod ? props.isRevealed : true;

        return (
            <div className={classNames(styles.selector, 'tiered-delivery-selection')}>
                <div className={styles.options}>
                    {deliveryMethods.map(dm => <Card
                        id={dm.id}
                        key={dm.id}
                        name={dm.name}
                        description={!areTdmsRevealed ? dm.checkAvailabilityDescription : (dm.status === 'UNAVAILABLE' ? dm.unavailableDescription : dm.description)}
                        tooltip={dm.status === 'UNAVAILABLE' ? dm.unavailableTooltip : ''}
                        price={dm.zone && (props.cartSubTotal > dm.zone?.minimumDiscountCartTotal && dm.zone?.minimumDiscountCartTotal ? dm.zone?.discountedCharge : dm.zone?.charge)}
                        isEnabled={!areTdmsRevealed || dm.status === 'ACTIVE'}
                        onSelect={this.handleSelectMethod}
                        isSelected={this.state.deliveryMethod === dm.id}
                        help="This delivery option is not available in your area"
                        icon={dm.iconDefault}
                        iconDisabled={dm.iconUnavailable}
                        iconSelected={dm.iconSelected || dm.iconDefault}
                        size={cardSize}
                        isSelectable={dm.status === 'ACTIVE' && !props.isSavingDelivery}
                        onClick={props.handleTdmClick}
                        isInProgress={props.isSavingDelivery}
                        isRevealed={areTdmsRevealed}
                    />
                    )}
                </div>

                {days.length > 1 && <>
                    <DatePicker onSelect={this.handleSelectDate} selected={this.state.deliveryDate} days={days} />
                    <hr className={styles.separator} />
                </>}

                {times.length > 0 && <TimePicker onSelect={this.handleSelectTime} selected={this.state.deliveryTime} times={times} />}
            </div>
        );
    }
}

const mapStateToProps = ({ auth, DELIVERY_METHOD, tdmReveal, cart }) => ({
    auth,
    deliveryMethods: DELIVERY_METHOD,
    isSavingDelivery: cart?.isRequestingDelivery ?? false,
    isRevealed: tdmReveal?.revealed ?? false
});

const mapDispatchToProps = (dispatch) => ({
    setDeliveryTime: bindActionCreators(setDeliveryTime, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);