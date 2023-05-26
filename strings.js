const express = require('express')
const app = express()
const port = 3000
/*
app.get('/api/strings', (req, res) => {
  res.send('Hello World!')
})*/

app.use(express.json())

app.patch('/api/strings', (req, res) => {
    const strings = req.body.strings ?? [];
    if(req.body.strings.length === 0){
        return res.sendStatus(404)
    }

    const CamelCase = strings.map(str => str[0].toUpperCase() + str.slice(1)).join('');
    res.status(200).json({CamelCase: CamelCase});
})

app.listen(port, () => {
  console.log(`À escuta em http://localhost:${port}`)
})




/*
const express = require("express")
const app = express()

const PORT = process.env.PORT ?? 3050

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))



*/
