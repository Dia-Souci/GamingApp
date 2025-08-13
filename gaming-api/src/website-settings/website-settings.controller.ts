import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Param,
} from '@nestjs/common';
import { WebsiteSettingsService } from './website-settings.service';
import { CreateWebsiteSettingsDto } from './dto/create-website-settings.dto';
import { UpdateWebsiteSettingsDto } from './dto/update-website-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('website-settings')
export class WebsiteSettingsController {
  constructor(private readonly websiteSettingsService: WebsiteSettingsService) {}

  @Get()
  findOne() {
    return this.websiteSettingsService.findOne();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createWebsiteSettingsDto: CreateWebsiteSettingsDto) {
    return this.websiteSettingsService.create(createWebsiteSettingsDto);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Body() updateWebsiteSettingsDto: UpdateWebsiteSettingsDto) {
    return this.websiteSettingsService.update(updateWebsiteSettingsDto);
  }

  @Post('featured-game/:gameId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  setFeaturedGame(@Param('gameId') gameId: string) {
    return this.websiteSettingsService.setFeaturedGame(gameId);
  }

  @Delete('featured-game')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeFeaturedGame() {
    return this.websiteSettingsService.setFeaturedGame(null);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove() {
    return this.websiteSettingsService.remove();
  }
}
