
// Some require to start the application

const cors = require("cors")

const express = require("express")

const uuid = require("uuid") // Library to generate the id

const app = express()

const port = 3001

app.use (express.json()) // warning the body we´ll use json 

app.use(cors())



const orders = []   // const that keep the data

// Middlewear to check the order id 

const checkOrderdId = (request, response, next) => { 
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index<0) { 
        return response.status(404).json({message: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id
    next() 
}

// Middlewear to show the method and url 

const method = (request, response, next) => { 
    console.log('Método - ',request.method)
    console.log('URL - ',request.url)
    next()
}

// POST method to creat new ordes

app.post('/order',  method , (request, response) => { 
    
    const { order, name, price } = request.body

    const newOrder = {id:uuid.v4(), order, name ,price, status: "Em preparação"}

    orders.push(newOrder)

    return response.json(newOrder)
})


// GET method to see all orders placed

app.get('/order', method , (request, response) => {
    return response.json(orders)
})

// PUT method to upadate orders 

app.put('/order/:id', checkOrderdId, method , (request, response) => {

    const index = request.orderIndex

    const id = request.orderId

    const { order, name, price, status } = request.body

    const updatedOrder = { id, order, name, price, status}

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

// DELETE method 

app.delete('/order/:id', checkOrderdId, method ,(request, response) => {

    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

// GET method to show a specific order

app.get('/order/:id', checkOrderdId, method , (request, response) => {

    const index = request.orderIndex

    const id = request.orderId

    orders.find( order => order.id === id) 

    return response.json(orders[index])
  
})

// PATCH method to update the order status

app.patch('/order/:id', checkOrderdId, method , (request, response) => {

    const index = request.orderIndex

    const id = request.orderId

    orders[index] = { ...orders[index], status: "Pronto" }

    const updatedOrder = orders[index]

    return response.json(updatedOrder)
})
 

app.listen(port, () => { 
    console.log(`🚀 Server started on port ${port}`)
}) 

