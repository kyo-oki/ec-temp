import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      message: 'ProGear Hub API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('api/info')
  getApiInfo() {
    return {
      name: 'ProGear Hub API',
      version: '1.0.0',
      description: 'E-commerce platform API for sports equipment',
      graphqlEndpoint: '/graphql',
      playground: '/graphql',
      documentation: 'See GRAPHQL_API_REFERENCE.md',
      features: [
        'Multi-tenant store management',
        'Product catalog with reviews',
        'Order management',
        'Content management (blog, FAQ, about)',
        'File uploads',
        'JWT authentication',
        'GraphQL API with introspection',
      ],
    };
  }
}
