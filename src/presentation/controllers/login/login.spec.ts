import { MissingParamError } from '@presentation/errors';
import { badRequest } from '@presentation/helpers/http-helper';
import { LoginController } from './login';

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): any => {
  const sut = new LoginController();
  return {
    sut,
  };
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpReponse = await sut.handle(httpRequest);
    expect(httpReponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
      },
    };

    const httpReponse = await sut.handle(httpRequest);
    expect(httpReponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
