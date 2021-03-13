import { LogErrorRepository } from '@data/protocols/log-error-repository';
import { AccountModel } from '@domain/models/account';
import { ok, serverError } from '@presentation/helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { LogControllerDecorator } from './log';

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())));
    }
  }
  const controllerStub = new ControllerStub();

  return controllerStub;
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  const logErrorRepositoryStub = new LogErrorRepositoryStub();

  return logErrorRepositoryStub;
};

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: 'johndoe',
      passwordConfirmation: 'johndoe',
    },
  };
};

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password',
  };
};
const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_error';

  return serverError(fakeError);
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    const fakeAccount = makeFakeAccount();
    expect(httpResponse).toEqual(ok(fakeAccount));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');

    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(
        new Promise(resolve => resolve(makeFakeServerError())),
      );

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_error');
  });
});
