import { LoadAccountByEmailRepository } from '@data/protocols/db/load-account-by-email-repository';
import { AccountModel } from '@domain/models/account';
import { AuthenticationModel } from '@domain/usecases/authentication';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => {
  const account: AccountModel = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  };
  return account;
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      const account = makeFakeAccount();
      return new Promise(resolve => resolve(account));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
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
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
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
});
