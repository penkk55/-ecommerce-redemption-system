// import { Injectable } from '@nestjs/common';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

// @Injectable()
// export class OrdersService {
//   create(createOrderDto: CreateOrderDto) {
//     return 'This action adds a new orderdd';
//   }

//   findAll() {
//     return `This action returns all orders`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} order`;
//   }

//   update(id: number, updateOrderDto: UpdateOrderDto) {
//     return `This action updates a #${id} order`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} order`;
//   }
// }

import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Make sure you have PrismaService

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma, StockStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const { customerId, products, total } = createOrderDto;

      // Check if customer exists and has sufficient balance
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new BadRequestException('Customer not found');
      }
      // Convert customer balance (Decimal) and total (Decimal) to number
      const customerBalance = parseFloat(customer.balance.toString());
      const orderTotal = parseFloat(total.toString());
      if (customerBalance < orderTotal) {
        throw new BadRequestException('Insufficient balance');
      }

      products.map((item) => {
        console.log('item', item);
      });
      // get product price
      const productPrices = await this.prisma.product.findMany({
        where: {
          id: {
            in: products.map((item) => item.productId),
          },
        },
      });
      console.log('productPrices', productPrices);

      // Check product availability and update stock
      for (const item of products) {
        const totalProductPrice = products.reduce((acc, product) => {
          // Find the price for the current product
          const productInfo = productPrices.find(
            (p) => p.id === product.productId,
          );
          if (productInfo) {
            // Calculate total price for the current product
            return (
              acc + parseFloat(productInfo.price.toString()) * product.quantity
            );
          }
          return acc;
        }, 0);
        console.log('totalProductPrice', totalProductPrice);
        console.log('total', total);

        if (totalProductPrice !== total) {
          throw new BadRequestException('Total price does not match');
        }

        const stock = await this.prisma.stock.findFirst({
          where: {
            productId: item.productId,
            status: StockStatus.IN_STOCK,
          },
        });

        if (!stock || stock.quantity < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product ${item.productId}`,
          );
        }

        // Update stock quantity
        await this.prisma.stock.update({
          where: { id: stock.id },
          data: { quantity: stock.quantity - item.quantity },
        });
      }

      // Deduct amount from customer balance
      await this.prisma.customer.update({
        where: { id: customerId },
        data: { balance: customerBalance - orderTotal },
      });

      if (productPrices.length !== products.length || !productPrices.length) {
        throw new BadRequestException('Product not found');
      }
      // Create the order
      const order = await this.prisma.order.create({
        data: {
          customerId,
          total,
          status: OrderStatus.PROCESSING, // Order status as processing
          createdAt: new Date(),
          updatedAt: new Date(),
          orderItems: {
            create: products.map((item) => {
              // Find the price for each product
              const product = productPrices.find(
                (p) => p.id === item.productId,
              );

              // Ensure the product is found and calculate the total
              if (!product) {
                throw new Error(`Product not found for ID: ${item.productId}`);
              }

              const productTotal = item.quantity * product.price.toNumber(); // Use product price

              return {
                productId: item.productId,
                quantity: item.quantity,
                total: productTotal, // Calculate total with actual price
                stockId: null, // Set this if you want to track stock specific to the order
              };
            }),
          },
        },
        include: {
          orderItems: true,
        },
      });

      return {
        transaction_id: order.id,
        status: OrderStatus.PROCESSING,
      };
    } catch (error) {
      console.error('createOrder: Error creating order', error);
      // Returning a more dynamic error response based on error type
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          message: error.message || 'Bad request',
          statusCode: error.getStatus(),
          error: 'Bad Request',
        });
      }
      // General server error fallback
      throw new InternalServerErrorException({
        message: 'Internal server error occurred while creating the order.',
        statusCode: 500,
        error: 'Internal Server Error',
      });
    }
  }
}
