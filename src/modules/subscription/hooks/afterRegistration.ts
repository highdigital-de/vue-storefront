export function afterRegistration({ Vue, config, store, isServer }) {
  if (!isServer) store.dispatch('subscription/postGetSubscription')
  if (!isServer) store.dispatch('subscription/getMeta')
}