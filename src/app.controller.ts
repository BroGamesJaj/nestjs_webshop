import { Controller, Get, Render, Query, Body, Res, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Payment } from './Payment';
import { PaymentDto} from './PaymentBack.dto';
import { Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  #payment: Payment[] = [];
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
    return {
      data: {},
      errors: []
    }
  }

  @Post('webshop')
  webshopFormPost(@Body() PaymentDto: PaymentDto,@Res() response : Response) {
    let errors = []
    if(!PaymentDto.name || !PaymentDto.bill_address || !PaymentDto.ship_address || !PaymentDto.card_number || !PaymentDto.exp_date || !PaymentDto.sec_code){
      errors.push("A kuponon kívül minden mezőt kötelező kitölteni!")
    }
    if(!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(PaymentDto.card_number)){
      errors.push("A számlaszám 0000-0000-0000-0000 formátumú legyen");
    }
    if(!/^.+, \d{4}, .+, .+ .+.$/.test(PaymentDto.bill_address)){
      errors.push("A számlázási cím (Ország, Irányítószám, Város, Utca házszám)")
    }
    if(!/^.+, \d{4}, .+, .+ .+.$/.test(PaymentDto.ship_address)){
      errors.push("A szállítási cím (Ország, Irányítószám, Város, Utca házszám)")
    }
    if(!/^[A-Z]{2}-\d{4}$/.test(PaymentDto.coupon_code) && PaymentDto.coupon_code){
      console.log(PaymentDto.coupon_code)
      errors.push("A kuponkód helytelen")
    }
    if(!/^\d\d\/\d\d$/.test(PaymentDto.exp_date)){
      errors.push("lejárati dátum hibás")
    }
    else if( parseInt("20"+PaymentDto.exp_date.split('/')[1]) < new Date().getFullYear() || parseInt(PaymentDto.exp_date.split('/')[0]) < new Date().getMonth()){
      errors.push("A kártya már lejárt")
    }
    if(!/^\d{3}$/.test(PaymentDto.sec_code)){
      errors.push("Biztonsági kód hibás")
    }
    if(errors.length > 0){
      response.render('webshop', 
        {
          data: PaymentDto,
          errors: errors
        }
      )
      return;
    }
    const newPayment: Payment = {
      name: PaymentDto.name,
      bill_address: PaymentDto.bill_address,
      ship_address: PaymentDto.ship_address,
      coupon_code: PaymentDto.coupon_code,
      card_number: PaymentDto.card_number,
      exp_date: PaymentDto.exp_date,
      sec_code: parseInt(PaymentDto.sec_code)
    }
    this.#payment.push(newPayment)
    response.redirect('paymentSuccess')

  }

  @Get('paymentSuccess')
  @Render('paymentSuccess')
  paymentSuccess(){

  }
}
