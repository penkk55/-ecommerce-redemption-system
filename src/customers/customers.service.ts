import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'prisma/prisma.service';
import e from 'express';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneBallance(email: string) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: {
          email: email,
        },
      });
      return {
        email: customer.email,
        balance: customer.balance,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error occurred while fetching products.',
        statusCode: 500,
        error: error,
      });
    }
  }
  async findCodes(email: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          customer: {
            email: email,
          },
        },
      });
      return orders;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error occurred while fetching products.',
        statusCode: 500,
        error: error,
      });
    }
  }
}
