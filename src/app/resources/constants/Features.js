/**
 * Modify this features list to match your testing scenario. 
 * You should replace the example feature names with the ones of your own splits.
 * 
 * This example is built to showcase how to work with two Split clients and evaluate
 * for keys of different traffic types. If you are interested on just testing one,
 * only use the USER_FEATURES constant and just leave the ACCOUNT_FEATURES array empty.
 * 
 * Also, user and account are not the only traffic types you can use. Read our docs for
 * more information or reach out to support@split.io if you need further assistance.
 */
export const USER_FEATURES = ['Tiered_Delivery', 'Tipple_Business', 'Tipple_Home', 'Web_Product_Cards'];
export const ACCOUNT_FEATURES = ['Tiered_Delivery', 'Tipple_Business'];
export const SPLIT_FEATURE_READ = 'SPLIT_FEATURE_READ';
export const SPLIT_READY = 'SPLIT_READY';
export const SPLIT_TIMED_OUT = 'SPLIT_TIMED_OUT';
