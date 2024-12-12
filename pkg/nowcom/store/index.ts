import { CoreStoreConfig, CoreStoreSpecifics } from '@shell/core/types';
import { PRODUCT_STORE } from '../config/constants';
import actions from './actions'
import mutations from './mutations'

import { tridentVariables } from '../config/store';

const vnetExtensionFactory = (): CoreStoreSpecifics => {
    return {
        state() {
            return {
                items: [],
                topNav: true,
                azureToken: ''
            }
        },
        getters: {
            items: (state: tridentVariables) => state.items,
            getTopNav: (state: tridentVariables) => state.topNav,
            getAzureToken: (state: tridentVariables) => state.azureToken
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