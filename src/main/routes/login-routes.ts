import { Router } from 'express';
import { adaptRoute } from '@main/adapters/express/express-route-adapter';
import { makeSignUpController } from '@main/factories/signup/signup-factory';
import { makeLoginController } from '@main/factories/login/login-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
