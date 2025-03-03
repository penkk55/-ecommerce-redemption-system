import { Controller, Get, Headers, BadRequestException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Endpoint } from 'src/constants/endpoint';

@Controller(Endpoint.ApiV1)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/balance')
  findOneBallance(@Headers('email') email: string) {
    if (!email) {
      throw new BadRequestException('email is required');
    }
    return this.customersService.findOneBallance(email);
  }

  @Get('/codes')
  findCodes(@Headers('email') email: string) {
    return this.customersService.findCodes(email);
  }
}
