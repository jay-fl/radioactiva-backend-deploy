import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { ActiveUser } from '../common/decorators/active-user-decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { UpdateCurrentPasswordDto } from './dto/update-current-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth(Role.USER)
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Auth(Role.USER)
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('profile/update')
  @Auth(Role.USER)
  async updateCurrentUser(
    @Body() updateUserAdminDto: UpdateUserAdminDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.usersService.updateCurrentUser(user.email, updateUserAdminDto);
  }

  @Patch(':id/admin-update')
  @Auth(Role.ADMIN)
  async updateByAdmin(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateUserAdminDto: UpdateUserAdminDto,
  ) {
    return this.usersService.updateByAdmin(+id, updateUserAdminDto);
  }

  @Post('profile/update-password')
  @Auth(Role.USER)
  async updateCurrentPassword(
    @Body() updateCurrentPasswordDto: UpdateCurrentPasswordDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.usersService.updateCurrentPassword(
      user.email,
      updateCurrentPasswordDto,
    );
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.usersService.remove(+id);
  }
}
