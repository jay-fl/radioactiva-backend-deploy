import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Jay, desde Get!';
  }

  getUpdate(): string {
    return 'Hello Jay, desde Update!';
  }
}
