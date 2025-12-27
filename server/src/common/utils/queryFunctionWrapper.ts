export async function requireEntity<T>(
  promise: Promise<T | null>,
  error: Error,
): Promise<T> {
  const result = await promise
  if (!result) throw error
  return result
}

