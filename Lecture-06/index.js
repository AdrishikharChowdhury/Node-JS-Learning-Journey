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

app.get("/edit/:notename",(req,res)=>{
    const fileName=req.params.notename
    const fullPath = path.join(filePath, `${fileName}.json`)
    fs.readFile(fullPath,"utf-8",(err,rawData)=>{
        const data=JSON.parse(rawData)
        res.render("edit",{ title:data.title, description: data.description }  )
    })
})

app.post("/edit",(req,res)=>{
    const fileName = req.body.prevtitle
    const { title, description } = req.body
    
    // ✅ SAFETY CHECKS
    if(!fileName || !title) {
        return res.status(400).send('Missing title or prevtitle')
    }
    
    const updatedData = { title, description }
    const cleanName = fileName.split(" ").join("")
    const fullPath = path.join(filePath, `${cleanName}.json`)
    const newPath = path.join(filePath, `${title.split(" ").join("")}.json`)
    
    fs.writeFile(fullPath, JSON.stringify(updatedData,null,2), "utf-8", (err)=>{
        if(err){
            console.log("Write Error:", err)
            return res.status(500).send('Write failed')
        }
        
        fs.rename(fullPath, newPath, (renameErr)=>{
            if(renameErr){
                console.log("Rename Error:", renameErr)
                return res.status(500).send('Rename failed')
            }
            console.log('✅ SAVED & RENAMED:', newPath)
            setTimeout(() => res.redirect("/"), 200)  // ↑ Increased delay
        })
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