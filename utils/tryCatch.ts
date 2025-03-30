type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const value = await promise;
    return { success: true, value };
  } catch (error) {
    return { success: false, error: error as E };
  }
}
