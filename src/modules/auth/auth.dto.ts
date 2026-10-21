import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional } from "class-validator";

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UpdateDto {
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @IsOptional()
    username: string;
}

export class PasswordDto {
    @IsString()
    @IsNotEmpty()
    old_password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    new_password: string;
}
