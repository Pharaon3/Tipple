import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isOrderTrackingUrl, getLandbotCustomData } from 'lib/util/landbot';
import { AnalyticsEvents } from 'lib/analytics';

const LandbotWidget = ({ url, currentUser }) => {
    const containerRef = useRef(null);
    const landbotUrl = useRef(null);
    const landbot = useRef(null);
    const trackingOrder = useSelector(state => state?.ORDER_TRACKING?.item ?? null);
    const hasRequestedOrderTracking = useSelector(state => state?.ORDER_TRACKING?.hasRequested ?? false);
    const theme = useSelector(state => state.theme);
    const isOrderTracking = isOrderTrackingUrl(url, theme);

    const fireAnalytics = () => {
        if (typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.support_request, {
                from: isOrderTracking ? 'Order Tracking' : 'Support',
                orderInProgress: trackingOrder?.status && ['COMPLETE', 'CANCELED'].includes(trackingOrder?.status) ? true : false
            });
        }
    };

    useEffect(() => {
        if (window?.Landbot && (hasRequestedOrderTracking || !isOrderTracking) && url !== landbotUrl.current) {
            const customData = getLandbotCustomData(theme, isOrderTracking, currentUser, trackingOrder);

            if (landbot.current) {
                landbot.current.destroy();
            }

            landbot.current = new window.Landbot.Livechat({
                container: containerRef.current,
                configUrl: url,
                customData
            });

            landbot.current.core.events.on('init', fireAnalytics);

            landbotUrl.current = url;
        }
    }, [url, containerRef, hasRequestedOrderTracking, isOrderTracking, landbotUrl]);

    useEffect(() => {
        return () => {
            if (landbot.current) {
                landbot.current.destroy();
            }
        };
    }, []);

    return <div className="LandbotWidget" ref={containerRef} />;
};

export default LandbotWidget;