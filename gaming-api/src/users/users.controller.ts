import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import { UserDocument } from './schemas/user.schema';
  import { UpdateProfileDto } from './dto/update-profile.dto';

  @Controller('users')
  @UseGuards(JwtAuthGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // GET /api/users (Admin only)
    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin', 'super_admin')
    findAll(@Query() query: any) {
      return this.usersService.findAll(query);
    }

    // GET /api/users/:id (Admin only)
    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'super_admin')
    findOne(@Param('id') id: string) {
      return this.usersService.findById(id);
    }

    // PATCH /api/users/profile (Current user only)
    @Patch('profile')
    updateProfile(@CurrentUser() user: UserDocument, @Body() updateData: UpdateProfileDto) {
      return this.usersService.updateProfile(user._id.toString(), updateData);
    }

    // DELETE /api/users/:id (Admin only)
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'super_admin')
    remove(@Param('id') id: string) {
      // Soft delete by deactivating account
      return this.usersService.deactivateUser(id);
    }
  }