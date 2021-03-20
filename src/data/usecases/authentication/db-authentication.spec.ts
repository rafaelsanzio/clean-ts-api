import { HashCompare } from '@data/protocols/criptografy/hash-compare';
import { TokenGenerator } from '@data/protocols/criptografy/token-generator';
import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@data/protocols/db/update-access-token-repository';
import { AccountModel } from '@domain/models/account';
import { AuthenticationModel } from '@domain/usecases/authentication';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => {
  const account: AccountModel = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
  };
  return account;
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel | undefined> {
      const account = makeFakeAccount();
      return new Promise(resolve => resolve(account));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }
  return new HashCompareStub();
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'));
    }
  }
  return new TokenGeneratorStub();
};

const makeFakeAuthentication = (): AuthenticationModel => {
  const authenticationModel = {
    email: 'any_email@mail.com',
    password: 'any_password',
  };
  return authenticationModel;
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashCompareStub: HashCompare;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    const authentication = makeFakeAuthentication();
    await sut.auth(authentication);
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const authentication = makeFakeAuthentication();
    const promise = sut.auth(authentication);
    await expect(promise).rejects.toThrow();
  });

  test('Should return undefined if LoadAccountByEmailRepository returns undefined', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => resolve(undefined)),
      );

    const authentication = makeFakeAuthentication();
    const accessToken = await sut.auth(authentication);
    expect(accessToken).toBeUndefined();
  });

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, 'compare');

    const authentication = makeFakeAuthentication();
    await sut.auth(authentication);
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const authentication = makeFakeAuthentication();
    const promise = sut.auth(authentication);
    await expect(promise).rejects.toThrow();
  });

  test('Should return undefined if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut();

    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)));

    const authentication = makeFakeAuthentication();
    const accessToken = await sut.auth(authentication);
    expect(accessToken).toBeUndefined();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    const authentication = makeFakeAuthentication();
    await sut.auth(authentication);
    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const authentication = makeFakeAuthentication();
    const promise = sut.auth(authentication);
    await expect(promise).rejects.toThrow();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut();

    const authentication = makeFakeAuthentication();
    const accessToken = await sut.auth(authentication);
    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update');

    const authentication = makeFakeAuthentication();
    await sut.auth(authentication);
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const authentication = makeFakeAuthentication();
    const promise = sut.auth(authentication);
    await expect(promise).rejects.toThrow();
  });
});
