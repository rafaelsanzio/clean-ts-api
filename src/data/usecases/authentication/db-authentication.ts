import { LoadAccountByEmailRepository } from '@data/protocols/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  async auth(authentication: AuthenticationModel): Promise<string | undefined> {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return undefined;
  }
}
