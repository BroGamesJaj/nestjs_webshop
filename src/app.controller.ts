import { Controller, Get, Render, Query, Body, Res, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Payment } from './Payment';
import { PaymentDto} from './PaymentBack.dto';
import { Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('webshop')
  @Render('webshop')
  webshop() {

  }

  @Post('webshopFromPost')
  webshopFormPost(@Body() PaymentDto: PaymentDto,@Res() response : Response) {
    
    let errors = []
    if(errors.length > 0){
      response.render('openAccountForm', 
        {
          data: PaymentDto,
          errors: errors
        }
      )
      return;
    }
    const newPayment: Payment = {
      name: 
    }
    this.#accounts.push(newAccount)
    response.redirect('openAccountSuccess')

  }
  @Get('webshopForm')
  @Render('payment_form')
  webshopForm() {

  }
}
