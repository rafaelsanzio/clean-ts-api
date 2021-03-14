import { makeSignUpValidation } from './signup-validation';
import { ValidationComposite } from '@presentation/helpers/validators/validation-composite';
import { RequiredFieldsValidation } from '@presentation/helpers/validators/required-field-validation';
import { Validation } from '@presentation/helpers/validators/validation';

jest.mock('@presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    const validations: Validation[] = [];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
