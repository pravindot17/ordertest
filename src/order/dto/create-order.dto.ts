import { IsEmail, IsString, Length, ValidateNested, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsNotEmpty() @IsString() @Length(3, 64)
  public readonly name: string;

  @IsNotEmpty() @IsNumber()
  public readonly amount: number;
}

class PaymentInfoDto {
  @IsNotEmpty() @IsString() @Length(3, 64)
  public readonly method: string;

  @IsNotEmpty() @IsString() @Length(12, 20)
  public readonly cardNumber: string;

  @IsNotEmpty() @IsString() @Length(5)
  public readonly expiry: string;

  @IsNotEmpty() @IsString() @Length(4)
  public readonly pin: string;
}

export class CreateOrderDto {
  public orderId: string;

  @IsNotEmpty() @IsString() @Length(3, 64)
  public readonly name: string;

  public orderState: any;

  @IsNotEmpty() @IsEmail()
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
