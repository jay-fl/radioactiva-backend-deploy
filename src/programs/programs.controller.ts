import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { Role } from '../common/enums/rol.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from '../upload-image/upload-image.service';

@Controller('programs')
export class ProgramsController {
  constructor(
    private readonly programsService: ProgramsService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  @Post()
  @Auth(Role.ADMIN)
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programsService.create(createProgramDto);
  }

  @Get()
  @Auth(Role.ADMIN)
  findAll() {
    return this.programsService.findAll();
  }

  @Get('public')
  findAllFront() {
    return this.programsService.findAllFront();
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.programsService.findOne(+id);
  }

  @Get('public/:id')
  findOneFront(@Param('id', IdValidationPipe) id: string) {
    return this.programsService.findOneFront(+id);
  }

  @Patch(':id')
  @Auth(Role.USER)
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ) {
    return this.programsService.update(+id, updateProgramDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.programsService.remove(+id);
  }

  @Post('upload-image')
  @Auth(Role.USER)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('La imagen es obligatoria');
    }
    return this.uploadImageService.uploadFile(file);
  }
}
