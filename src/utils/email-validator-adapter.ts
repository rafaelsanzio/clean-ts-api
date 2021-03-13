import validator from 'validator';

import { EmailValidator } from '@presentation/protocols/email-validator';
import { DbAddAccount } from '@data/usecases/add-account/db-add-account';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
