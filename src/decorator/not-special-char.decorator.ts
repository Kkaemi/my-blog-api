import { applyDecorators } from '@nestjs/common';
import { NotContains } from 'class-validator';

export function NotSpecialChar() {
  const specialChar = '!@#$%^&*()_+|~-=`[]{};:"<>?';

  return applyDecorators(
    ...specialChar.split('').map((char) => NotContains(char)),
    NotContains("'"),
    NotContains('\\'),
  );
}
