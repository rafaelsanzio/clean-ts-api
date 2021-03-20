import { EmailValidatorAdapter } from '@main/adapters/validators/email-validator-adapter';
import {
  EmailValidation,
  RequiredFieldsValidation,
  ValidationComposite,
  CompareFieldsValidation,
} from '@presentation/helpers/validators';
import { Validation } from '@presentation/protocols/validation';

export const makeSignUpValidation = (): ValidationComposite => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

  const validations: Validation[] = [];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidation(field));
  }

  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation'),
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
