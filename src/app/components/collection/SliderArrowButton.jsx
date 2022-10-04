import React from 'react';
import classNames from 'classnames';

export function SliderArrowButton({ direction, customClass, style, onClick, handleSliderClick }) {
	return (
		<div
			className={classNames(customClass)}
			style={{ 
				...style, 
				display: 'flex', 
				color: `var(--grey-${!onClick ? '300' : '900' })`,
				cursor: !onClick ? 'default' : 'pointer',
			}}
			onClick={() => {
				onClick && onClick();
				handleSliderClick && handleSliderClick();
			}}
		>
			<i className={`fa fa-chevron-${direction ?? 'left'}`} />
		</div>
	);
};

export default SliderArrowButton;