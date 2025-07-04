import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const ds = app.get<DataSource>(DataSource);
    await ds.synchronize(true); // drops & re-creates all tables
  });
  afterAll(async () => {
    const ds = app.get<DataSource>(DataSource);
    await ds.dropDatabase(); // drops the test database schema
    await app.close();
  });

  it('Auth route', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'e2eName', email: 'e2e@email.com', password: 'password' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'e2e@email.com', password: 'password' })
      .expect(200);

    jwt = res.body.accessToken;
    expect(jwt).toBeDefined();
  });
});
