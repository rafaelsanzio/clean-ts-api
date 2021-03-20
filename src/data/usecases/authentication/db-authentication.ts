import { HashCompare } from '@data/protocols/criptografy/hash-compare';
import { TokenGenerator } from '@data/protocols/criptografy/token-generator';
import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashCompare: HashCompare;
  private readonly tokenGenerator: TokenGenerator;
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(authentication: AuthenticationModel): Promise<string | undefined> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email,
    );
    if (account) {
      await this.hashCompare.compare(authentication.password, account.password);
      await this.tokenGenerator.generate(account.id);
    }
    return undefined;
  }
}
