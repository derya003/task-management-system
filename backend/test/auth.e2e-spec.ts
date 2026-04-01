import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request, { Response } from 'supertest';
import { AppModule } from '../src/app.module';

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface LoginResponse {
  message: string;
  access_token: string;
}

describe('Auth API (e2e)', () => {
  let app: INestApplication;
  let server: ReturnType<INestApplication['getHttpServer']>;

  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: '123456',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/register → kullanıcı oluşturma', async () => {
    const res: Response = await request(server)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    const body = res.body as RegisterResponse;

    expect(body.message).toBeDefined();
    expect(body.user.email).toBe(testUser.email);
  });

  it('POST /api/auth/login → başarılı giriş', async () => {
    const res: Response = await request(server)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(201);

    const body = res.body as LoginResponse;

    expect(body.access_token).toBeDefined();
    expect(typeof body.access_token).toBe('string');
  });
});
