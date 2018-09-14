import 'reflect-metadata'
import {createKoaServer} from "routing-controllers"
import GameController from "./game/controller"

const port = process.env.PORT || 4000

const app = createKoaServer({
   controllers: [GameController]
})

app.listen(port, () => console.log(`Listening on port ${port}`))