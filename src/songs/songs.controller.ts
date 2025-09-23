import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { GetSongsQueryDto } from './dto/get-song.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from '../upload-image/upload-image.service';

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  @Post()
  @Auth(Role.ADMIN) // ✅ Solo admin puede crear
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Get()
  @Auth(Role.ADMIN) // ✅ Solo admin puede ver todas las canciones
  findAll(@Query() query: GetSongsQueryDto) {
    const take = query.take ? query.take : 10;
    const skip = query.skip ? query.skip : 0;
    return this.songsService.findAll(take, skip);
  }

  // Ruta pública para el frontend
  @Get('public')
  findAllPublic(@Query() query: GetSongsQueryDto) {
    const take = query.take ? query.take : 10;
    const skip = query.skip ? query.skip : 0;
    return this.songsService.findAll(take, skip);
  }

  @Get(':id')
  @Auth(Role.ADMIN) // ✅ Solo admin puede ver detalles
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.songsService.findOne(+id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN) // ✅ Solo admin puede actualizar
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    return this.songsService.update(+id, updateSongDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN) // ✅ Solo admin puede eliminar
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.songsService.remove(+id);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('La imagen es obligatoria');
    }
    return this.uploadImageService.uploadFile(file);
  }
}
