import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'email_queue',
      queueOptions: {
        durable: false,
      },
    },
  })

  //app.use(helmet())

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
