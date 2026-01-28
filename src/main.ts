import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { ConsoleLogger } from '@nestjs/common';
import cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'CRM',
    }),
  });
  app.use(cors());
  const port = process.env.PORT || 4000;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
