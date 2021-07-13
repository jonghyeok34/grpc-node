const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;


const text = process.argv[2];

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())


client.createTodo({
    "id": -1,
    "text": text
}, (err, response) =>{
    console.log("Recieved from server" + JSON.stringify(response));
})

// client.readTodos({},(err,response)=>{
    
//     console.log("Recieved from server(read)" + JSON.stringify(response));
//     if(response.items)
//         response.items.forEach(a=>console.log(a));
// })

const call = client.readTodosStream();
call.on("data", (todo)=>{
    // console.table(item)
    console.log("received item from server: "+ JSON.stringify(todo));
})
call.on("end", e => console.log("server done!"));