import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as path from 'path';

interface LoginResponse {
  access_token: string;
}

describe('Attachments API (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let token: string;
  let createdTaskId: number;
  let attachmentId: number;

  const testUser = {
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

    // 🔐 login
    const loginRes = await request(server)
      .post('/api/auth/login')
      .send(testUser)
      .expect(201); // ⚠️ senin login 201 dönüyor

    token = (loginRes.body as LoginResponse).access_token;

    // 🧩 task oluştur (ATTACHMENT için)
    const taskRes = await request(server)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Attachment Test Task',
        description: 'Test için oluşturuldu',
        category: 'general',
      })
      .expect(201);

    createdTaskId = taskRes.body.id;

    // 🛑 ekstra güvenlik
    expect(createdTaskId).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /tasks/:taskId/attachments → dosya yüklenir', async () => {
    const res = await request(server)
      .post(`/tasks/${createdTaskId}/attachments`) // ✅ BAŞINDA /
      .set('Authorization', `Bearer ${token}`)
      .attach(
        'files',
        path.join(__dirname, 'Task_Management_Web_Application-edited.pdf'),
      )
      .expect(201);

    expect(Array.isArray(res.body)).toBe(true);
    attachmentId = res.body[0].id;
    expect(attachmentId).toBeDefined();
  });

  it('GET /tasks/:taskId/attachments → dosyalar listelenir', async () => {
    const res = await request(server)
      .get(`/tasks/${createdTaskId}/attachments`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /tasks/attachments/:id → dosya silinir', async () => {
    await request(server)
      .delete(`/tasks/attachments/${attachmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
