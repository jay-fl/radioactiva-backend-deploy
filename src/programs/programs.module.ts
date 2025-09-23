import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { User } from '../users/entities/user.entity';
import { UploadImageModule } from '../upload-image/upload-image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Program, User]), UploadImageModule],
  controllers: [ProgramsController],
  providers: [ProgramsService],
})
export class ProgramsModule {}
