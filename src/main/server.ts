import env from '@main/config/env';

import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper';

MongoHelper.connect(env.mongoURL)
  .then(async () => {
    const app = (await import('./config/app')).default;

    app.listen(env.port, () => console.log(`Server running at ${env.port}`));
  })
  .catch(console.error);
