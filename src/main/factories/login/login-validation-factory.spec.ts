import {
  EmailValidation,
  RequiredFieldsValidation,
  ValidationComposite,
} from '@presentation/helpers/validators';
import { makeLoginValidation } from './login-validation-factory';
import { Validation } from '@presentation/protocols/validation';
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
