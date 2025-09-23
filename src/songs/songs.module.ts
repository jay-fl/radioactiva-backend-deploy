import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { UploadImageModule } from '../upload-image/upload-image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Song]), UploadImageModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
