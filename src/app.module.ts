import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return Object.assign(await getConnectionOptions(), {
          timezone: 'Z',
          entities: ['dist/**/*.entity{.ts,.js}'],
          namingStrategy: new SnakeNamingStrategy(),
        });
      },
    }),
    PostsModule,
    TagsModule,
    AuthModule,
    UsersModule,
    CommentsModule,
    FilesModule,
  ],
})
export class AppModule {}
