import { vnetVariables, Vnets } from '../config/store';

export default {
  setItems(state: vnetVariables, items: Vnets[]) {
      state.items = items
  },
  addItem(state: vnetVariables, item: Vnets) {
      state.items.push(item)
  },
  updateItem() {
      // do nothing
  },
  removeItem(state: vnetVariables, itemName: string) {
      state.items = state.items.filter(item => item.name !== itemName)
  }
}