import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Program } from '../programs/entities/program.entity';
import { UploadImageModule } from '../upload-image/upload-image.module';

@Module({
  imports: [TypeOrmModule.forFeature([News, Program]), UploadImageModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
