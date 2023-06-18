const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connection } = require("./server");
const { userRouter } = require("./Routes/user.routes");
const professionalRouter = require("./Routes/professional.routes");
const serviceRouter = require("./Routes/services.routes");
const googleRouter = require("./Controllers/google.oauth");

const appoinmentRouter = require("./Routes/appointment.routes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/professional", professionalRouter);
app.use("/services", serviceRouter);
app.use("/appointment", appoinmentRouter);

app.use("/login", googleRouter);
// app.get("/", (req, res) => {
//   res.send("heelllooo");
// });
app.listen(process.env.PORT, () => {
  connection();
});
