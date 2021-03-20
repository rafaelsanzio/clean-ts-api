import env from '@main/config/env';

import { LogControllerDecorator } from '@main/decorators/log-controller-decorator';
import { LoginController } from '@presentation/controllers/login/login-controller';

import { Controller } from '@presentation/protocols';

import { DbAuthentication } from '@data/usecases/authentication/db-authentication';

import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '@infra/db/mongodb/log/log-mongo-repository';
import { BcryptAdapter } from '@infra/criptografy/bcrypt-adater/bcrypt-adapter';
import { JwtAdapter } from '@infra/criptografy/jwt-adapter/jwt-adapter';

import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation(),
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
