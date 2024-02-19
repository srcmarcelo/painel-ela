import { TypedSupabaseClient } from '@/utils/types'

export function getClasses(client: TypedSupabaseClient) {
  return client
    .from('classes')
    .select()
}