import type { PluginContext, PluginStorage, PluginLogger } from './plugin'

export function createPluginContext(
  pluginId: string,
  organizationId: string
): PluginContext {
  const storage: PluginStorage = {
    async get(key: string) {
      // TODO: Implement with Supabase storage
      return null
    },
    async set(key: string, value: string) {
      // TODO: Implement with Supabase storage
    },
    async delete(key: string) {
      // TODO: Implement with Supabase storage
    },
  }

  const logger: PluginLogger = {
    info(message, meta) {
      console.log(`[plugin:${pluginId}] ${message}`, meta ?? '')
    },
    warn(message, meta) {
      console.warn(`[plugin:${pluginId}] ${message}`, meta ?? '')
    },
    error(message, meta) {
      console.error(`[plugin:${pluginId}] ${message}`, meta ?? '')
    },
  }

  return { pluginId, organizationId, storage, logger }
}
