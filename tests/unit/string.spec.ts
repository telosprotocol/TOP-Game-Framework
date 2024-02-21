import { formatNum, stringShield } from '@/utils/string';
import {
  formatFloatBase,
  formatNumberInAbbreviationBase,
} from '../../src/utils/string';

test('formatNum', () => {
  expect(formatNum(10, ',')).toBe('10');
  expect(formatNum(1000, ',')).toBe('1,000');
  expect(formatNum('10000', ',')).toBe('10,000');
  expect(formatNum(100000, ',')).toBe('100,000');
  expect(formatNum(-100000, ',')).toBe('-100,000');
  expect(formatNum(-1000000, ',')).toBe('-1,000,000');
});

describe('formatFloat', () => {
  it('Test default precision=1', () => {
    expect(formatFloatBase(10.33)).toBe('10.3'); //    precision=1
    expect(formatFloatBase(10000.4, { separator: '.', decimalMark: ',' })).toBe(
      '10.000,4'
    );
  });
  it('Test for id', () => {
    expect(formatFloatBase(10000.4, { separator: '.', decimalMark: ',' })).toBe(
      '10.000,4'
    );
  });

  it('Test for integer number and zero precision', () => {
    expect(
      formatFloatBase(523, { precision: 0, reserveZeroDecimal: true })
    ).toBe('523');
    expect(
      formatFloatBase(-523, { precision: 0, reserveZeroDecimal: true })
    ).toBe('-523');
    expect(
      formatFloatBase(-5234, { precision: 0, reserveZeroDecimal: true })
    ).toBe('-5,234');
    expect(
      formatFloatBase(-5234, { precision: 0, reserveZeroDecimal: false })
    ).toBe('-5,234');
  });

  it('Test for integer number and non-zero precision', () => {
    expect(
      formatFloatBase(523, { precision: 3, reserveZeroDecimal: true })
    ).toBe('523.000');
    expect(
      formatFloatBase(523, { precision: 3, reserveZeroDecimal: false })
    ).toBe('523');
    expect(
      formatFloatBase(5234, { precision: 3, reserveZeroDecimal: false })
    ).toBe('5,234');
    expect(
      formatFloatBase(-5234, { precision: 3, reserveZeroDecimal: false })
    ).toBe('-5,234');
  });

  it('Test for real number and zero precision', () => {
    expect(formatFloatBase(523.6789, { precision: 0 })).toBe('523');
    expect(formatFloatBase(-523.6789, { precision: 0 })).toBe('-523');
  });

  it('Test for real number and non-zero precision less than the original', () => {
    expect(
      formatFloatBase(523.6789, { precision: 2, reserveZeroDecimal: true })
    ).toBe('523.67');
    expect(
      formatFloatBase(-123.45678, { precision: 4, reserveZeroDecimal: true })
    ).toBe('-123.4567');
    expect(
      formatFloatBase(456.0003, { precision: 3, reserveZeroDecimal: true })
    ).toBe('456.000');
    expect(
      formatFloatBase(456.0, { precision: 2, reserveZeroDecimal: false })
    ).toBe('456');
    expect(
      formatFloatBase(456.03, { precision: 3, reserveZeroDecimal: false })
    ).toBe('456.03');
  });

  it('Test for reserveZeroDecimal=false', () => {
    expect(
      formatFloatBase(523.03, { precision: 1, reserveZeroDecimal: false })
    ).toBe('523');
    expect(
      formatFloatBase(-523.03, { precision: 1, reserveZeroDecimal: false })
    ).toBe('-523');
  });
  it('Test for real number and non-zero precision greater than the original', () => {
    expect(
      formatFloatBase(523.67, { precision: 4, reserveZeroDecimal: true })
    ).toBe('523.6700');
    expect(
      formatFloatBase(523.678, { precision: 4, reserveZeroDecimal: true })
    ).toBe('523.6780');
    expect(
      formatFloatBase(-523.678, { precision: 4, reserveZeroDecimal: true })
    ).toBe('-523.6780');
  });

  it('Test for zero and non-zero precision', () => {
    expect(formatFloatBase(0, { precision: 3, reserveZeroDecimal: true })).toBe(
      '0.000'
    );
  });

  it('Test for non-zero number and precision equals to the original', () => {
    expect(
      formatFloatBase(456.789, { precision: 3, reserveZeroDecimal: true })
    ).toBe('456.789');
  });

  it('Test Big Decimal', () => {
    expect(
      formatFloatBase(4.55 + 0.6, {
        precision: 6,
        reserveZeroDecimal: true,
      })
    ).toBe('5.150000');
    expect(
      formatFloatBase(4.55 + 0.6, {
        precision: 6,
        reserveZeroDecimal: false,
      })
    ).toBe('5.15');
  });
});

describe('formatNumberInAbbreviationBase', () => {
  const langOption = {
    separator: ',',
    decimalMark: '.',
    KMGT: {
      K: 'K',
      M: 'M',
      G: 'G',
      T: 'T',
    },
  };

  test('should correctly format integer number', () => {
    expect(formatNumberInAbbreviationBase(12345, 5, 2, langOption)).toBe(
      '12,345'
    );
  });

  test('should correctly format floating number', () => {
    expect(formatNumberInAbbreviationBase(12.455478, 6, 4, langOption)).toBe(
      '12.4554'
    );
    expect(formatNumberInAbbreviationBase(0.123456, 6, 6, langOption)).toBe(
      '0.12345'
    );
    expect(formatNumberInAbbreviationBase(0.1234567, 6, 6, langOption)).toBe(
      '0.12345'
    );
    expect(formatNumberInAbbreviationBase(-0.1234567, 6, 6, langOption)).toBe(
      '-0.12345'
    );
  });

  test('should remove trailing zeros after decimal point', () => {
    expect(formatNumberInAbbreviationBase(12.1, 5, 2, langOption)).toBe('12.1');
  });

  test('should abbreviate large numbers with B, M, K', () => {
    expect(formatNumberInAbbreviationBase(1000000, 6, 2, langOption)).toBe(
      '1M'
    );
    expect(formatNumberInAbbreviationBase(1000000000, 6, 2, langOption)).toBe(
      '1G'
    );
    expect(formatNumberInAbbreviationBase(-1000000000, 6, 2, langOption)).toBe(
      '-1G'
    );
    expect(formatNumberInAbbreviationBase(1000, 6, 2, langOption)).toBe(
      '1,000'
    );
  });

  test('should truncate decimal part for large numbers', () => {
    expect(formatNumberInAbbreviationBase(1234567.89, 6, 2, langOption)).toBe(
      '1.23M'
    );
  });

  test('should respect maxLength limit', () => {
    expect(formatNumberInAbbreviationBase(123456, 3, 0, langOption)).toBe(
      '123.45K'
    );
    expect(formatNumberInAbbreviationBase(12.3456, 3, 0, langOption)).toBe(
      '12'
    );
  });
  test('should support maxKMGT maxLength limit', () => {
    const curLangOption = {
      ...langOption,
      maxKMGT: 'M' as const,
    };
    expect(formatNumberInAbbreviationBase(123456, 3, 0, curLangOption)).toBe(
      '123.45K'
    );
    expect(formatNumberInAbbreviationBase(12.3456, 3, 0, curLangOption)).toBe(
      '12'
    );
    expect(
      formatNumberInAbbreviationBase(1234567.89, 6, 0, curLangOption)
    ).toBe('1.23M');
    expect(
      formatNumberInAbbreviationBase(1234567890123, 6, 0, curLangOption)
    ).toBe('1,234,567.89M');
  });
});
describe('stringShield', () => {
  it('specialCase', () => {
    expect(stringShield('')).toBe('');
    expect(stringShield('1')).toBe('1');
  });
  it('should return the same string if the length is less than or equal to 15 and accurate stars', () => {
    expect(stringShield('12')).toBe('1*'); //2/3==>1
    expect(stringShield('123')).toBe('1*3'); //3/3==>1
    expect(stringShield('1234')).toBe('1**4'); // 2
    expect(stringShield('12345')).toBe('12**5'); //5/3==>2
    expect(stringShield('123456')).toBe('12**56'); //6/3==>2
    expect(stringShield('1234567')).toBe('12***67'); //7/3==>3
    expect(stringShield('12345678')).toBe('123***78'); //8/3==>3
    expect(stringShield('123456789')).toBe('123***789'); //9/3==>3
    expect(stringShield('1234567890')).toBe('123****890'); //10/3==>4
    expect(stringShield('12345678901')).toBe('1234****901'); //11/3==>4
    expect(stringShield('123456789012')).toBe('1234****9012'); //12/3==>4
    expect(stringShield('1234567890123')).toBe('1234*****0123'); //13/3==>5
    expect(stringShield('12345678901234')).toBe('12345*****1234'); //14/3=5
  });

  it('should return the same string if the length is equal to 15 and accurate stars', () => {
    expect(stringShield('123456789012345')).toBe('12345*****12345');
  });

  it('should return a string with 5 stars in the middle if the length is greater than 15', () => {
    expect(stringShield('123456789012345678')).toBe('12345*****45678');
  });
});
