import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  public constructor() {}

  @Get()
  public async healthCheck() {
    return 'healthy';
  }
}
