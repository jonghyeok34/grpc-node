const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos": readTodos,
    "readTodosStream": readTodosStream
});
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), ()=>{
    server.start()
});
// server.start();

// call - request
// callback - response
const todos =[];
function createTodo(call, callback){
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem);
    callback(null, todoItem);

}

function readTodos(call, callback){
    callback(null, {"items": todos});
}

function readTodosStream(call, callback){
    if(todos){

        todos.forEach(todo => {
            console.log(todo)
            call.write(todo);
        });
        call.end();
    }
}