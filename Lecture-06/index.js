const express=require("express")
const path=require("path")
const fs=require("fs")
const app=express()

filePath="./files"

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    fs.readdir(`${filePath}`, (err,filenames)=>{
        const files=filenames.filter(f=>f.endsWith('.json')).map(file=>{
            const content=fs.readFileSync(path.join(filePath,file),'utf-8')
            const data=JSON.parse(content)
            const note={
                title: data.title,
                description: data.description,
                filename: path.join(filePath,file)
            }
            return note
        })
        res.render("index",{ files: files })
    })
})

app.get("/note/:notename",(req,res)=>{
    const fileName=req.params.notename
    const fullPath = path.join(filePath, `${fileName}.json`)
    fs.readFile(fullPath,"utf-8",(err,rawData)=>{
        const data=JSON.parse(rawData)
        res.render("note",{ title:data.title, description: data.description }  )
    })
    
})

app.post("/create", (req, res) => {

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    
    const title = req.body.title.split(" ").join("");
    const filename = path.join(filePath,`${title}.json`)
    
    fs.writeFile(filename, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            console.error('Write error:', err);
            return res.status(500).send('Error saving note');
        }
        console.log('Note saved:', filename);
        res.redirect("/");
    });
    
    console.log('Form data:', req.body); // This runs BEFORE writeFile callback
});

app.listen(3000,()=>{
    console.log("Server Running")
})