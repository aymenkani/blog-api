const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://admin-aymen:HdRkSjX43xgA4t77@cluster0.lnxpg.mongodb.net/testing-blog?retryWrites=true&w=majority')
})

afterEach(async () => {
    await mongoose.connection.db.dropDatabase({ dbName: 'testing-blog' })
})

afterAll(async () => {
    await mongoose.connection.close()
})