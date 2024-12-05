import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Endpoint } from 'src/constants/endpoint';

@Controller(Endpoint.ApiV1 + 'orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.getOrders();
  }

  @Get('/:orderId')
  findOne(@Param('orderId') id: string) {
    return this.ordersService.findOne(id);
  }
}
