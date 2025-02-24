import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './modules/menu/menu.module';
import { HealthController } from './health.controller';

@Module({
  imports: [MenuModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
