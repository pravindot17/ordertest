import { IsEmail, IsString, Length, IsNumber } from 'class-validator';

export class CreateOrderDto {
  public readonly id: string;
  @IsString() @Length(3, 64) public readonly name: string;
  @IsEmail() public readonly email: string;
  @IsString() @Length(3, 64) public readonly address: string;
  @IsNumber() @Length(1, 5) public readonly totalAmount: number;
}
