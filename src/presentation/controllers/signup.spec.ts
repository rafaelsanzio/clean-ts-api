import { SignUpController } from './signup';
import { MissingParamError } from '../errors/missing-params-error';

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'johndoe@mail.com',
        password: 'johndoe',
        passwordConfirmation: 'johndoe',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'John Doe',
        password: 'johndoe',
        passwordConfirmation: 'johndoe',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        passwordConfirmation: 'johndoe',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no password confirmation is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: 'johndoe',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });
});
