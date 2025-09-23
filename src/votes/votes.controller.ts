import {
  Controller,
  Get,
  Post,
  Body,
  //Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
//import { UpdateVoteDto } from './dto/update-vote.dto';
import { GetSongsQueryDto } from './dto/get-vote.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Get()
  findAll(@Query() query: GetSongsQueryDto) {
    const song = query.song_id ? query.song_id : null;
    return this.votesService.findAll(song!);
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.votesService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', IdValidationPipe) id: string,
  //   @Body() updateVoteDto: UpdateVoteDto,
  // ) {
  //   return this.votesService.update(+id, updateVoteDto);
  // }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.votesService.remove(+id);
  }
}
