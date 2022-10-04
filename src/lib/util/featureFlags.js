export const isFeatureOn = (featureFlags, feature) => featureFlags && featureFlags[feature] && featureFlags[feature] === 'on';

export default {
    isFeatureOn
};