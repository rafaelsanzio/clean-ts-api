import { CompareFieldsValidation } from '@presentation/helpers/validators/compare-fields-validation';
import { RequiredFieldsValidation } from '@presentation/helpers/validators/required-field-validation';
import { Validation } from '@presentation/helpers/validators/validation';
import { ValidationComposite } from '@presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

  const validations: Validation[] = [];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidation(field));
  }

  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation'),
  );

  return new ValidationComposite(validations);
};
