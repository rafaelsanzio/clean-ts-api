import { makeLoginValidation } from './login-validation';
import { ValidationComposite } from '@presentation/helpers/validators/validation-composite';
import { RequiredFieldsValidation } from '@presentation/helpers/validators/required-field-validation';
import { Validation } from '@presentation/protocols/validation';
import { CompareFieldsValidation } from '@presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '@presentation/helpers/validators/email-validation';
import { EmailValidator } from '@presentation/protocols/email-validator';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

jest.mock('@presentation/helpers/validators/validation-composite');

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const requiredFields = ['email', 'password'];

    const validations: Validation[] = [];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field));
    }

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
