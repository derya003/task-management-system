import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('Görev yönetimi sistemi için API dokümantasyonu')
    .setVersion('1.0')
    // 🔒 Swagger UI'ye "BearerAuth" şeması ekliyoruz
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description: 'JWT token: "Bearer <token>" formatında girin.',
      },
      'jwt', // bu isim güvenlik tanımnı referanslamak için kullanılır.
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // token girildikten sonra kaybolmasın
    },
  });

  // CORS'u aktif et
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend adresine izin ver. sadece bu adresten gelen isteklere izin ver aanlamına gelir
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
