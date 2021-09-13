import { ValidationPipe } from '@nestjs/common';

describe('ValidationPipePipe', () => {
  it('should be defined', () => {
    expect(new ValidationPipe()).toBeDefined();
  });
});
