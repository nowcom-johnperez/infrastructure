import { importTypes } from '@rancher/auto-import';
import {
  IPlugin,
  ActionLocation,
  PanelLocation,
  TabLocation,
  CardLocation,
  TableColumnLocation,
  ActionOpts,
} from '@shell/core/types';
import extensionRouting from './routing/extension-routing';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);
  // Provide extension metadata from package.json
  // it will grab information such as `name` and `description`
  plugin.metadata = require('./package.json');
  // Load a product
  plugin.addProduct(require('./product'));

  plugin.addAction(
    ActionLocation.HEADER,
    {},
    {
      tooltipKey: 'plugin-examples.header-action-one',
      tooltip:    'Test Action1',
      shortcut:   'm',
      icon:       'icon-storage',
      invoke(opts: any, resources: any) {
        console.log('action executed 1', this); // eslint-disable-line no-console
        console.log(opts); // eslint-disable-line no-console
        console.log(resources); // eslint-disable-line no-console
      }
    }
  );

  plugin.addCard(
    CardLocation.CLUSTER_DASHBOARD_CARD,
    { cluster: ['local'] },
    {
      label:     'Nowcom',
      labelKey:  '',
      component: () => import('./components/MastheadDetailsComponent.vue')
    }
  );

  // Add Vue Routes
  plugin.addRoutes(extensionRouting);
}
