export function updateCache<T extends object>(
  oldData: T[] | undefined,
  newData: T,
  key: keyof T
) {
  if (!oldData) return oldData;
  const index = oldData.findIndex((data) => data[key] === newData[key]);
  oldData.splice(index, 1, newData);
  return [...oldData];
}
