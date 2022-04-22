import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Observable } from 'rxjs';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const data = this.usersService.create(createUserDto);
    return res.status(204).send(data);
  }

  @Get('findAll')
  findAll(@Res() res: Response) {
    const data = this.usersService.findAll();
    return res.status(201).send(data);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Res() res: Response) {
    const data = this.usersService.remove(+id);
    return res.status(204).send(data);
  }
}
