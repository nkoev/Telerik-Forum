import { Module } from '@nestjs/common';
import { CommentsInMemoryStorage } from './comments-in-memory-storage';

@Module({
  providers: [CommentsInMemoryStorage],
  exports: [CommentsInMemoryStorage],
})
export class DatabaseModule {}
