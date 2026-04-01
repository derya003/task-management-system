/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Task API (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let taskId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // LOGIN
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'e2e@test.com',
        password: '123456',
      });

    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/tasks → görev oluşturma', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'E2E Task',
        description: 'Test task',
        dueDate: '2025-12-31',
        category: 'Work',
      })
      .expect(201);

    taskId = res.body.id;
  });

  it('GET /api/tasks → kullanıcının görevleri', async () => {
    await request(app.getHttpServer())
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('DELETE /api/tasks/:id → görev silme', async () => {
    await request(app.getHttpServer())
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
