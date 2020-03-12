import { Module } from '@nestjs/common';
import { PostsInMemoryStorage } from './posts-in-memory-storage';

@Module({
  providers: [PostsInMemoryStorage],
  exports: [PostsInMemoryStorage],
})
export class DatabaseModule {}
