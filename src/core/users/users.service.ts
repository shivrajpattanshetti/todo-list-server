import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { join } from 'path';
import {
  createReadStream,
  createWriteStream,
  readFile,
  readFileSync,
  writeFileSync,
} from 'fs';
import { writeFile } from 'fs/promises';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  path = './authorUsers.json';
  onModuleInit() {
    this.createJsonFile();
  }
  /**
   * API call to create new todo
   * @param createUserDto todo  list DTO
   * @returns success message
   */
  create(createUserDto: CreateUserDto) {
    // read file data
    try {
      const content = JSON.parse(readFileSync(this.path, 'utf8'));
      // edit or add todo
      Object.assign(createUserDto, { key: content.to_do_list.length + 1 });
      content.to_do_list.push(createUserDto);
      //write file
      writeFileSync(this.path, JSON.stringify(content));
      return { message: 'Successfuly added your details !!' };
    } catch (e: any) {}
  }

  /**
   * API call to Fetch available details
   * @returns success message with all details
   */
  findAll(): Observable<any> {
    try {
      const content = JSON.parse(readFileSync(this.path, 'utf8'));
      // edit or add todo
      return content;
    } catch (e: any) {}
    // res.status(404).send('Not Found');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const content = JSON.parse(readFileSync(this.path, 'utf8'));
      // update
      const indexInfo = content.to_do_list.findIndex((item: any) => {
        return item.key === id;
      });
      content.to_do_list.splice(indexInfo, 1, updateUserDto);
      //write file
      writeFileSync(this.path, JSON.stringify(content));
      return { message: 'Successfuly updated your details !!' };
    } catch (e: any) {}
  }

  /**
   *
   * @param id delete ID
   * @returns return successmessage
   */
  remove(id: number) {
    // read file data
    try {
      const content = JSON.parse(readFileSync(this.path, 'utf8'));
      // delete
      const indexInfo = content.to_do_list.findIndex((item: any) => {
        return item.key === id;
      });
      content.to_do_list.splice(indexInfo, 1);

      //write file
      writeFileSync(this.path, JSON.stringify(content));
      return { message: 'Successfuly deleted your details !!' };
    } catch (e: any) {}
  }

  /**
   * Method call to generate JSON file
   */
  async createJsonFile(): Promise<void> {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    file.on('data', async (packageJson: any) => {
      const users: any = {
        author: 'Shivraj Pattanshetti',
        version: packageJson.version,
        time_stamp: this.getTime(),
        to_do_list: [
          { projectName: 'shivPutra', key: 1, technology: 'Angular' },
          { projectName: 'rajPutra', key: 2, technology: 'Java' },
          { projectName: 'pattanPutra', key: 3, technology: 'Node' },
          { projectName: 'shettiPutra', key: 4, technology: 'Mongo' },
        ],
      };
      readFile(this.path, async (error, users1: any) => {
        // If already Not exist create new one
        if (error) {
          writeFile(this.path, JSON.stringify(users));
          return;
        }
      });
    });
  }

  getTime() {
    const newDate = new Date();
    return `${newDate.getDate()} ${newDate.toLocaleString('default', {
      month: 'long',
    })} ${newDate.getFullYear()} at ${newDate.toLocaleString('default', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })} `;
  }
}
