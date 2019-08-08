import { IsEmail, IsString, Length, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString() @Length(3, 64)
  public readonly name: string;

  @IsNumber()
  public readonly amount: number;
}

class PaymentInfoDto {
  @IsString() @Length(3, 64)
  public readonly method: string;

  @IsString() @Length(12, 20)
  public readonly cardNumber: string;

  @IsString() @Length(5)
  public readonly expiry: string;

  @IsString() @Length(4)
  public readonly pin: string;
}

export class CreateOrderDto {
  public orderId: string;

  @IsString() @Length(3, 64)
  public readonly name: string;

  public orderState: any;

  @IsEmail()
  public readonly email: string;

  @IsString() @Length(3, 64)
  public readonly address: string;

  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  public readonly products: ProductDto[];

  @ValidateNested({ each: true })
  @Type(() => PaymentInfoDto)
  public paymentDetails: PaymentInfoDto;
}
