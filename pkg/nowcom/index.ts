import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';
import extensionRouting from './routing/extension-routing';
import extensionStore from './store';
import HomePage from './pages/home.vue';
import './assets/css/custom.css'
// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);
  // Provide extension metadata from package.json
  // it will grab information such as `name` and `description`
  plugin.metadata = require('./package.json');
  // Load a product
  plugin.addProduct(require('./product'));

  plugin.setHomePage(HomePage)

  // Add Vue Routes
  plugin.addRoutes(extensionRouting);

  plugin.addDashboardStore(extensionStore.config.namespace, extensionStore.specifics, extensionStore.config);
}
