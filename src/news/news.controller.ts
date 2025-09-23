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
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { GetNewsQueryDto } from './dto/get-news.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user-decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from '../upload-image/upload-image.service';

//@Auth(Role.USER)
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  @Post()
  @Auth(Role.USER)
  create(
    @Body() createNewsDto: CreateNewsDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.newsService.create(createNewsDto, user);
  }

  @Get()
  @Auth(Role.USER)
  findAll(
    @Query() query: GetNewsQueryDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    const take = query.take ? query.take : 10;
    const skip = query.skip ? query.skip : 0;
    return this.newsService.findAll(query.program_id, take, skip, user);
  }

  @Get('public')
  findAllFront(@Query() query: GetNewsQueryDto) {
    const take = query.take ? query.take : 10;
    const skip = query.skip ? query.skip : 0;
    return this.newsService.findAllFront(query.program_id, take, skip);
  }

  @Get(':id')
  @Auth(Role.USER)
  findOne(
    @Param('id', IdValidationPipe) id: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.newsService.findOne(+id, user);
  }

  @Get('public/:id')
  findOneFront(@Param('id', IdValidationPipe) id: string) {
    return this.newsService.findOneFront(+id);
  }

  @Patch(':id')
  @Auth(Role.USER)
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.newsService.update(+id, updateNewsDto, user);
  }

  @Delete(':id')
  @Auth(Role.USER)
  remove(
    @Param('id', IdValidationPipe) id: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.newsService.remove(+id, user);
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
