//------------------------------------------------Importing Modules----------------------------------------------------------------//
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");

const PORT = process.env.PORT || 5000;
const app = express();

// ---------------------------------------------------------Express Handling------------------------------------------------------- //
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
// app.use(express.static(process.cwd() +"/client/build"));
app.use(cors());

// ---------------------------------------------------------Mongoose Handling------------------------------------------------------- //

const dataSchema = new mongoose.Schema({
  id: String,
  trade_type: String,
  quantity: Number,
  price: Number,
});

const Data = new mongoose.model("Data", dataSchema);
// -----------------------------------------------------Connecting to Database------------------------------------------------------- //
mongoose
  .connect("mongodb://localhost:27017/stockpricecalculator", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// ---------------------------------------------------------Routes Handling------------------------------------------------------- //

app.post("/api/upload", (req, res) => {
  const data = req.body.data;
  data.forEach((element) => {
    if (element.trade_type) {
      element.trade_type.toLowerCase();
    } else {
      data.pop();
    }
  });
  console.log(data);
  Data.insertMany(data, (err, docs) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log(docs);
      res.status(200).send(docs);
    }
  });
});

app.post("/api/reset", (req, res) => {
  Data.deleteMany({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log(docs);
      res.status(200).send(docs);
    }
  });
});

app.get("/api/data", (req, res) => {
  Data.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      // console.log(docs);
      let avg; //Initializing the average price
      let totalp = 0; // Total Price
      let totalq = 0; // Total Quantity

      let buydata = []; // Array to store buy data

      let data = docs.map((element) => {
        if (element.trade_type === "BUY") {
          buydata.push({ price: element.price, quantity: element.quantity });
          totalp += element.quantity * element.price;
          totalq += element.quantity;
          avg = totalp / totalq;
          return { _id:element._id,id:element.id,trade_type:element.trade_type,quantity:element.quantity,price:element.price, avg: avg };
        } else if (element.trade_type === "SELL") {
          let cur_quantity = element.quantity;
          while (cur_quantity > 0) {
            let cur_price = buydata[0].price;
            let cur_quantity_to_sell = Math.min(
              cur_quantity,
              buydata[0].quantity
            );
            totalp -= cur_quantity_to_sell * cur_price;
            totalq -= cur_quantity_to_sell;
            cur_quantity -= cur_quantity_to_sell;
            buydata[0].quantity -= cur_quantity_to_sell;
            if (buydata[0].quantity === 0) {
              buydata.shift();
            }
          }
          avg = totalp / totalq;
          return { _id:element._id,id:element.id,trade_type:element.trade_type,quantity:element.quantity,price:element.price, avg: avg };
        }
      });
      // console.log(data);
      // console.log(docs);
      res.status(200).send(data);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
