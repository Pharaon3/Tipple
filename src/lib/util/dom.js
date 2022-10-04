
export const dispatchGlobalEvent = (eventName, opts, target = document) => {
    // Compatible with IE
    // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
    let event;

    if (typeof window.CustomEvent === 'function') {
        event = new window.CustomEvent(eventName, { detail: opts });
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, false, true, opts);
    }

    if (target) {
        target.dispatchEvent(event);
    }
};

export const scrollToRef = (scrollRef = { current: window }, ref, offset = 0) => {
    scrollRef.current.scrollTo(
        0,
        ref.current.offsetTop > offset ? ref.current.offsetTop - offset : ref.current.offsetTop
    );
};

export const onKeyUpEscape = (e, onEsc) => {
    switch (e.keyCode) {
        case 27: // ESC, close the modal
            onEsc(e);
            break;

        default:
    }
};

export const stopEventPropagation = e => {
    e.stopPropagation();
    return false;
};

export default {
    dispatchGlobalEvent,
    scrollToRef,
    onKeyUpEscape,
    stopEventPropagation
};
