import {
  HashCompare,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  Authentication,
  AuthenticationModel,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashCompare: HashCompare;
  private readonly encrypter: Encrypter;
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.encrypter = encrypter;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth(authentication: AuthenticationModel): Promise<string | undefined> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email,
    );
    if (account) {
      const isValid = await this.hashCompare.compare(
        authentication.password,
        account.password,
      );
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken,
        );
        return accessToken;
      }
    }
    return undefined;
  }
}
