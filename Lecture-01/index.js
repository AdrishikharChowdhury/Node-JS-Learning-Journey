const fs=require('fs');

fs.writeFile("Hello World.txt","Hello World in Node JS",(err)=>{
    if(err) console.error(err);
    else console.log("Done");
})

fs.appendFile("Hello World.txt","\nAppended a new sentence using Node JS",(err)=>{
    if(err) console.error(err);
    else console.log("Appended");
})

// fs.rename("Hello World.txt","helloworld.txt",(err)=>{
//     if(err) console.error(err);
//     else console.log("Renamed");
// }) Rename

// fs.unlink("helloworld.txt",(err)=>{
//     if(err) console.log(err);
//     else console.log("Removed");
// }) Delete

// fs.copyFile("helloworld.txt","./copy/helloworldcopy.txt",(err)=>{
//     if(err) console.log(err);
//     else console.log("Copied");
// }) Copy

fs.rm("./copy",{ recursive: true, force: true },(err)=>{
    if(err) console.log(err.message);
    else console.log("Removed Folder");
})

const http=require("http");

const server=http.createServer((req,res)=>{
    res.end("Hello World");
    console.log("Server is running");
})

server.listen(3000);