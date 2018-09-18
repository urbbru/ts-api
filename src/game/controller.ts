import {JsonController, Get, Post, Put, Body, Param, HttpCode, NotFoundError, BadRequestError} from 'routing-controllers'
import Game from './entity';

import { moves, colors, defaultBoard } from './data'

@JsonController()
export default class GameController {

    @Get('/games')
    allGames = async () => {
       const games = await Game.find()
       return { games }
    }

    @Post('/games')
    @HttpCode(201)
    createGame(
      @Body() game: Game
    ) {
      if(Object.keys(game).length > 1) throw new BadRequestError('you can only specify 1 value, which is ->name<-')
      if(!game.hasOwnProperty('name')) throw new BadRequestError('you can only specify ->name<-')
      game.color = colors[Math.floor(Math.random() * colors.length)]
      game.board = defaultBoard
      return game.save()
    }

    @Put('/games/:id')
    async updateGame(
      @Param('id') id: number,
      @Body() update: Partial<Game>
    ) {
      if(update.id) throw new BadRequestError('You cant change the id of a game')
      
      if(update.color) {
        if(!colors.includes(update.color)) throw new BadRequestError(`that is not a valid color, use one of these ${colors}`)
      }

      const game = await Game.findOne(id)
      if(!game) throw new NotFoundError('Game not found djais')

      if(update.board) {
        if(!Array.isArray(update.board)) throw new BadRequestError(`please input board correctly, like this ${game.board[0]} - ${game.board[1]} - ${game.board[2]}`)
        if(!Array.isArray(update.board[0]) || 
            !Array.isArray(update.board[1]) || 
            !Array.isArray(update.board[2])) throw new BadRequestError(`please input board correctly, like this ${game.board[0]} - ${game.board[1]} - ${game.board[2]}`)
        if(moves(update.board, game.board) > 1) throw new BadRequestError(`you can only make 1 move per reuqest, current board is ${game.board[0]} - ${game.board[1]} - ${game.board[2]}`)
      }

      return Game.merge(game, update).save()
    }

}