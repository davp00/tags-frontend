import { binarySearch, SearchableComparable } from '~/util/binarysearch';

describe('binary Search', () => {
  const items: number[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const itemToFind = 5;
  const getComparable: Function = (
    toFind: number
  ): SearchableComparable<number> => {
    return {
      isGreaterThan(value: number): boolean {
        return toFind > value;
      },
      isLessThan(value: number): boolean {
        return toFind < value;
      },
      isEqualTo(value: number): boolean {
        return toFind === value;
      },
    };
  };

  it('should return index of 5', function () {
    const result = binarySearch(items, getComparable(itemToFind));
    expect(result).toEqual(items.indexOf(itemToFind));
  });

  it('should return null on item 11 not found', function () {
    expect(binarySearch(items, getComparable(11))).toBeNull();
  });
});
