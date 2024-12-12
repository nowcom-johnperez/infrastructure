import { tridentVariables, Vnets } from '../config/store';

export default {
  setItems(state: tridentVariables, items: Vnets[]) {
      state.items = items
  },
  addItem(state: tridentVariables, item: Vnets) {
      state.items.push(item)
  },
  updateItem() {
      // do nothing
  },
  removeItem(state: tridentVariables, itemName: string) {
      state.items = state.items.filter(item => item.name !== itemName)
  },
  setTopNavState(state: tridentVariables, status: boolean) {
    state.topNav = status
  },
  setAzureToken(state: tridentVariables, token: string) {
    state.azureToken = token
  }
}