import { useContext } from 'react';
import { WindowSizeContext } from 'app/providers/WindowSizeProvider';

export function useWindowSize() {
	return useContext(WindowSizeContext);
}