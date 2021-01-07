import { Tag } from '~/definitions/tag';

export interface SearchableComparable<T> {
  isEqualTo(value: T): boolean;
  isLessThan(value: T): boolean;
  isGreaterThan(value: T): boolean;
}

export function binarySearch<T>(
  arr: T[],
  { isEqualTo, isLessThan, isGreaterThan }: SearchableComparable<T>
): number | null {
  let start = 0;
  let end = arr.length - 1;
  let mid;

  while (start <= end) {
    mid = Math.floor((start + end) / 2);

    if (isEqualTo(arr[mid])) return mid;
    else if (isLessThan(arr[mid])) start = mid + 1;
    else if (isGreaterThan(arr[mid])) end = mid - 1;
  }

  return null;
}

export const tagBinarySearchComparable = (
  toFind: Tag
): SearchableComparable<Tag> => {
  return {
    isEqualTo(value: Tag): boolean {
      return toFind.pid === value.pid;
    },
    isGreaterThan(value: Tag): boolean {
      return toFind.pid > value.pid;
    },
    isLessThan(value: Tag): boolean {
      return toFind.pid < value.pid;
    },
  };
};
