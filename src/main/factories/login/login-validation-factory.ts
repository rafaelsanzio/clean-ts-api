import { EmailValidatorAdapter } from '@main/adapters/validators/email-validator-adapter';
import {
  EmailValidation,
  RequiredFieldsValidation,
  ValidationComposite,
} from '@presentation/helpers/validators';
import { Validation } from '@presentation/protocols/validation';

export const makeLoginValidation = (): ValidationComposite => {
  const requiredFields = ['email', 'password'];

  const validations: Validation[] = [];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
