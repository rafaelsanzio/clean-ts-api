import {
  EmailValidation,
  RequiredFieldsValidation,
  ValidationComposite,
  CompareFieldsValidation,
} from '@presentation/helpers/validators';
import { makeSignUpValidation } from './signup-validation';
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

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
