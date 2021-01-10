import {
  binarySearch,
  SearchableComparable,
  tagBinarySearchComparable,
} from '~/util/binarysearch';
import { testTag } from '~/test/mocks';
import { Tag } from '~/definitions/tag';

describe('binary Search', () => {
  const length = 50;

  const items: number[] = Array.from(
    { length },
    (_, k) => k + 1
  ).reverse() as number[];

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

  it(`should return null on item ${length + 1} not found`, function () {
    expect(binarySearch(items, getComparable(length + 1))).toBeNull();
  });

  describe('tag Binary Search Comparable', () => {
    it('Compare', function () {
      const comparable = tagBinarySearchComparable(testTag);
      const tagToCompare: Tag = {
        name: 'TEST',
        id: 'testId',
        pid: 123,
        color: '#ffffff',
      };

      expect(comparable.isEqualTo(tagToCompare)).toBeTruthy();

      tagToCompare.pid = 124;

      expect(comparable.isLessThan(tagToCompare)).toBeTruthy();

      tagToCompare.pid = 122;

      expect(comparable.isGreaterThan(tagToCompare)).toBeTruthy();
    });
  });
});
