import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

interface LoginResponse {
  access_token: string;
}

interface UserResponse {
  id: number;
  email: string;
  role: string;
}

describe('User API (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let adminToken: string;

  const adminUser = {
    email: 'deryadurgun@gmail.com',
    password: '123456',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();

    // 🔐 Admin login
    const loginRes = await request(server)
      .post('/api/auth/login')
      .send(adminUser)
      .expect(201); // ✅

    const body = loginRes.body as LoginResponse;
    adminToken = body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/user → admin tüm kullanıcıları görebilir', async () => {
    const res = await request(server)
      .get('/api/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const users = res.body as UserResponse[];

    expect(Array.isArray(users)).toBe(true);

    if (users.length > 0) {
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('email');
      expect(users[0]).toHaveProperty('role');

      // 🔒 password kesinlikle gelmemeli
      expect(users[0]).not.toHaveProperty('password');
    }
  });
});
