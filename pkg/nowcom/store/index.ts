import { CoreStoreConfig, CoreStoreSpecifics } from '@shell/core/types';
import { PRODUCT_NAME } from '../config/constants';
import actions from './actions'
import mutations from './mutations'

import { vnetVariables } from '../config/store';

const vnetExtensionFactory = (): CoreStoreSpecifics => {
    return {
        state() {
            return {
                items: [],
            }
        },
        getters: {
            items: (state: vnetVariables) => state.items,
        },
        mutations: {
            ...mutations
        },
        actions: {
            ...actions
        }
    }
}

const config: CoreStoreConfig = { namespace: PRODUCT_NAME };

export default {
    specifics: vnetExtensionFactory(),
    config,
};