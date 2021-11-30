import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  async create(@Req() request, @Res() response) {
    try {
      await this.fileUploadService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }

  @Get()
  async pegaURLPublica(@Body() body){
    // return body.nome
    return await this.fileUploadService.getUrl(body.nome);
  }
}
