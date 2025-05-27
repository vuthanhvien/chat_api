import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService, LoginDto, RegisterDto } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user with email and password.',
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Endpoint for user login with email and password.',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Endpoint to initiate the forgot password process.',
  })
  forgotPassword(@Body('email') email: string) {
    // Implement forgot password logic here
    return { message: 'Forgot password functionality not implemented yet' };
  }
  @Post('reset-password')
  resetPassword(@Body('token') token: string) {
    // Implement reset password logic here
  }

  @Post('change-password')
  changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    // Implement change password logic here
    return { message: 'Change password functionality not implemented yet' };
  }

  @Post('logout')
  logout() {
    // Implement logout logic here
    return { message: 'Logout functionality not implemented yet' };
  }
  @Post('refresh-token')
  refreshToken(@Body('token') token: string) {
    // Implement refresh token logic here
    return { message: 'Refresh token functionality not implemented yet' };
  }
  @Post('verify-email')
  verifyEmail(@Body('token') token: string) {
    // Implement email verification logic here
    return { message: 'Email verification functionality not implemented yet' };
  }
  @Post('resend-verification-email')
  resendVerificationEmail(@Body('email') email: string) {
    // Implement resend verification email logic here
    return {
      message: 'Resend verification email functionality not implemented yet',
    };
  }
  @Post('update-profile')
  updateProfile(@Body('userId') userId: string, @Body() dto: RegisterDto) {
    // Implement update profile logic here
    return { message: 'Update profile functionality not implemented yet' };
  }
  @Post('delete-account')
  deleteAccount(@Body('userId') userId: string) {
    // Implement delete account logic here
    return { message: 'Delete account functionality not implemented yet' };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getUserInfo(@Req() req) {
    const userId = req.user.userId;
    return this.authService.getUserInfo(userId);
  }
}
