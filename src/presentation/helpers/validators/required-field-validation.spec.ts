import { MissingParamError } from '@presentation/errors';
import { RequiredFieldsValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidation('field');
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not return if validation succeds', () => {
    const sut = new RequiredFieldsValidation('field');
    const error = sut.validate({ field: 'any_name' });
    expect(error).toBeUndefined();
  });
});
