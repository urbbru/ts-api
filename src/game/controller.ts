import {JsonController, Get, Post, Put, Body, Param, HttpCode, NotFoundError, BadRequestError} from 'routing-controllers'
import Game from './entity';
const data = require('./data')

const moves = (board1, board2) => board1
                        .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
                        .reduce((a, b) => a.concat(b))
                        .length

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

      const randieColor = data.colors[Math.floor(Math.random() * data.colors.length)]

      game.color = randieColor

      return game.save()
    }

    @Put('/games/:id')
    async updateGame(
      @Param('id') id: number,
      @Body() update: Partial<Game>
    ) {
      if(update.color) {
        if(!data.colors.includes(update.color)) throw new BadRequestError(`that is not a valid color, use one of these ${data.colors}`)
      }

      const game = await Game.findOne(id)
      if(!game) throw new NotFoundError('Game not found djais')

      if(update.board) {
        if(moves(update.board, game.board) > 1) throw new BadRequestError(`you can only make 1 move per reuqest, current board is ${game.board[0]} - ${game.board[1]} - ${game.board[2]}`)
      }

      return Game.merge(game, update).save()
    }

}