const mongoose = require("mongoose");
const app = require("./app");
const socket = require("./socketIo");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const server = app.listen(process.env.PORT || 3000, () => {
      if (process.env.NODE_ENV === "development") {
        console.log("Server is up and running on port 3000");
      }
    });

    socket.initSocket(server);
  })
  .catch((err) => {
    //console.log(err);
    throw new Error("Database connection failed!");
  });
