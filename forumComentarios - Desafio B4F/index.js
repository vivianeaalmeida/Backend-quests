const express = require("express")
const { getMongoCollection } = require("./data")
const { ObjectId } = require("mongodb")

const PORT = process.env.PORT ?? 5030

const app = express()
app.use(express.json())

//CRIAR NOVA PUBLICAÇÃP  NO FORUM -  Posts e Comments  

app.post("/api/forum", async (req, res) => {

    try {
        if (!req.body) {
            res.status(400).json({ message: "no_body" })
        } else {
            const post = req.body
            const collection = await getMongoCollection("forum_posts")
            const result = await collection.insertOne({ ...post, likes: 0 })
            const id = result.insertedId

            res.status(201).json({ _id: id });
        }
    } catch (err) {
        console.log(err)
    }
})
//GET NOVA PUBLICAÇÃO TO ARRAY  NO FORUM 


app.get("/api/forum", async (req, res) => {

    try {
        const collection = await getMongoCollection("forum_posts")
        const result = await collection.find().toArray() // alterações find by ID 
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
    }
})


//GET NOVA PUBLICAÇÃO TO ARRAY  NO FORUM   VAI RECEBER E ADICIONAR UM COMENTARIO
app.post("/api/forum/:id/comment", async (req, res) => {

    try {
        const postCollection = await getMongoCollection("forum_posts")
        const post = await postCollection.findOne({ _id: new ObjectId(req.params.id) })

        if (!post) {
            res.status(404).json({ message: "not_found" })
        } else if (Object.keys(req.body).length === 0) {
            res.status(400).json({ message: "no_body" })
        } else {
            const collection = await getMongoCollection("forum_comments")
            const adicionarComentario = await collection.insertOne({
                post_id: new ObjectId(req.params.id),
                author: req.body.author,
                content: req.body.content
            })
            const id = adicionarComentario.insertedId
            res.status(201).json({ _id: id })
        }
    } catch (err) {
        console.log(err)
    }
})


//GET BY IDS  -  VAI PROCURAR COM IDS DOS OBJETOS


app.get("/api/forum/:id", async (req, res) => {

    try {
        const commentsCol = await getMongoCollection("forum_comments")
        const postsCol = await getMongoCollection("forum_posts")

        const post = await postsCol.findOne({ _id: new ObjectId(req.params.id) })
        const postComments = await commentsCol.find({ post_id: new ObjectId(req.params.id) }).toArray()
        console.log(postComments)
        if (!post) {
            res.status(404).json({ message: "not_found" })
        }
        post.comments = postComments

        
        res.status(200).json(post)

    } catch (err) {
        console.log(err)
    }
})


//PATCH PARA ATUALIZAR OS   BY IDS  -  VAI PROCURAR COM IDS DOS OBJETOS 


app.patch("/api/forum/:id/like", async (req, res) => {

    try {

        const collectionPost = await getMongoCollection("forum_posts")
        const acharPost = await collectionPost.findOne({ _id: new ObjectId(req.params.id) })
        if (!acharPost) {
            res.status(404).json({ message: "not_found" })
        } else {
            const addLike = await getMongoCollection("forum_posts")
            await addLike.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $inc: { likes: 1 } }
            )
            res.sendStatus(201)
        }

    } catch (err) {
        console.log(err)
    }
})

app.listen(PORT, () => console.log("Server is Listening"))