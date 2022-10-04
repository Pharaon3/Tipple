import React, { useState, useEffect } from 'react';

export const WindowSizeContext = React.createContext();

export function WindowSizeProvider({ children }) {
	let initial = { width: 0, height: 0 };

	try {
		initial = { width: window?.innerWidth ?? 0, height: window?.innerHeight ?? 0};
	} catch(e) {}

	const [size, setSize] = useState(initial);

	const updateWindowWidth = () => {
		try {
			setSize({
				width: window?.innerWidth,
				height: window?.innerHeight
			});
		} catch(e) {}
	}

	useEffect(() => {
		try {
			if (window) {
				window.addEventListener('resize', updateWindowWidth);
			}
		} catch(e) {}

		return () => {
			try {
				if (window) {
					window.removeEventListener('resize', updateWindowWidth);
				}
			} catch(e) {}
		};
	});

	return (
		<WindowSizeContext.Provider value={size}>{children}</WindowSizeContext.Provider>
	);
}

