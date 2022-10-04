import { 
  SPLIT_FEATURE_READ, 
  SPLIT_READY,
  SPLIT_TIMED_OUT
} from  '../constants/Features';

const initialState = {
  ready: false,
  featuresRead: false,
  timedOut: false,
  /**
   * This map is going to be empty on it's default state, so no flags.
   * It's definitely valid to assign a different default state.
   */
  flags: {
    Tiered_Delivery: 'off',
    Tipple_Home: 'off',
    Web_Product_Cards: 'off'
  }
};

/**
 * 
 * @param {Object} state - The current state associated with this reducer
 * @param {Object} params - The action params, including the type.
 */
function featuresReducer(state = initialState, { type, treatments }) {
  switch (type) {
    case SPLIT_READY:
      return {
        ...state,
        ready: true
      };
    case SPLIT_FEATURE_READ:
      return {
        ...state,
        ready: true,
        featuresRead: true,
        flags: treatments
      };
    case SPLIT_TIMED_OUT:
      return {
        ...state,
        featuresRead: true,
        timedOut: true
      };
    default:
      return state;
  }
} 

export default featuresReducer;