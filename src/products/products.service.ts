import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(offset: number, limit: number) {
    try {
      // Fetch the products with pagination
      const products = await this.prisma.product.findMany({
        skip: offset, // Skip the number of records based on offset
        take: limit, // Limit the number of records fetched
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Fetch the total count of products
      const total = await this.prisma.product.count();

      // Calculate the current page (page starts from 1, not 0)
      const currentPage = Math.floor(offset / limit) + 1;

      // Calculate total pages (rounded up)
      const totalPages = Math.ceil(total / limit);

      return {
        products,
        total,
        currentPage,
        totalPages,
        offset,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error occurred while fetching products.',
        statusCode: 500,
        error: error,
      });
    }
  }
}
