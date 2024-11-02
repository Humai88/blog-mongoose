import {app} from './app'
import { runDB } from './db/mongo-db'
import { SETTINGS } from './settings'


const startApp = async () => {    
    await runDB()
    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}

startApp()