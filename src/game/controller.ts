import {JsonController, Get, Post, Put, Body, Param, HttpCode, NotFoundError, BadRequestError} from 'routing-controllers'
import Game from './entity';

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
      const colors = [
        'red', 
        'blue', 
        'green', 
        'yellow', 
        'magenta'
      ]
      const randieColor = colors[Math.floor(Math.random() * colors.length)]
      game.color = randieColor
      game.board = [
        ['o', 'o', 'o'],
        ['o', 'o', 'o'],
        ['o', 'o', 'o']
      ]
      return game.save()
    }

    @Put('/games/:id')
    async updateGame(
      @Param('id') id: number,
      @Body() update: Partial<Game>
    ) {
      console.log("id")
      console.log(id)
      console.log("update")
      console.log(update)
      console.log("color inputted")
      console.log(update.color)
      const colors = [
        'red', 
        'blue', 
        'green', 
        'yellow', 
        'magenta'
      ]
      if(update.color) {
        if(!colors.includes(update.color)) throw new BadRequestError(`that is not a valid color, use one of these ${colors}`)
      }

      const game = await Game.findOne(id)
      if(!game) throw new NotFoundError('Game not found djais')

      return Game.merge(game, update).save()
    }

}