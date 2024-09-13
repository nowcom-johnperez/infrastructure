import { CoreStoreConfig, CoreStoreSpecifics } from '@shell/core/types';
import { PRODUCT_STORE } from '../config/constants';
import actions from './actions'
import mutations from './mutations'

import { vnetVariables } from '../config/store';

const vnetExtensionFactory = (): CoreStoreSpecifics => {
    return {
        state() {
            return {
                items: [],
                topNav: true
            }
        },
        getters: {
            items: (state: vnetVariables) => state.items,
            getTopNav: (state: vnetVariables) => state.topNav
        },
        mutations: {
            ...mutations
        },
        actions: {
            ...actions
        }
    }
}

const config: CoreStoreConfig = { namespace: PRODUCT_STORE };

export default {
    specifics: vnetExtensionFactory(),
    config,
};