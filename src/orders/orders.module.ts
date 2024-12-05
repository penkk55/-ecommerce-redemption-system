import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [OrdersController],
  imports: [PrismaModule],
  providers: [OrdersService],
})
export class OrdersModule {}
