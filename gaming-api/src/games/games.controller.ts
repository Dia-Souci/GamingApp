import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { GamesService } from './games.service';
  import { CreateGameDto } from './dto/create-game.dto';
  import { UpdateGameDto } from './dto/update-game.dto';
  
  @Controller('games')
  export class GamesController {
    constructor(private readonly gamesService: GamesService) {}
  
    // POST /api/games
    @Post()
    create(@Body() createGameDto: CreateGameDto) {
      return this.gamesService.create(createGameDto);
    }
  
    // GET /api/games
    @Get()
    findAll(@Query() query: any) {
      return this.gamesService.findAll(query);
    }
  
    // GET /api/games/featured
    @Get('featured')
    getFeatured(@Query('limit') limit?: number) {
      return this.gamesService.getFeatured(limit);
    }
  
    // GET /api/games/search
    @Get('search')
    search(@Query('q') searchTerm: string, @Query('limit') limit?: number) {
      return this.gamesService.search(searchTerm, limit);
    }
  
    // GET /api/games/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.gamesService.findOne(id);
    }
  
    // GET /api/games/slug/:slug
    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
      return this.gamesService.findBySlug(slug);
    }
  
    // PATCH /api/games/:id
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
      return this.gamesService.update(id, updateGameDto);
    }
  
    // DELETE /api/games/:id
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.gamesService.remove(id);
    }
  }