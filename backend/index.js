import dotenv from "dotenv";
dotenv.config({ quiet: true });

import e from "express";
import { ObjectId } from "mongodb";
import cors from "cors";
import { collectionName, connection } from "./dbconfig.js";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = e();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend ka URL (cookie ke liye zaroori)
    credentials: true,
  }),
);

app.use(e.json());
app.use(cookieParser()); // FIX: pehle 2 baar likha tha, ab ek hi baar

// ---------- SIGNUP ----------
app.post("/signup", async (req, res) => {
  const useData = req.body;
  if (useData.email && useData.password) {
    const db = await connection();
    const collection = await db.collection("user");

    const result = await collection.insertOne(useData);
    if (result) {
      jwt.sign(useData, "Google", { expiresIn: "1115d" }, (error, token) => {
        // FIX: signup par bhi cookie server se set kar di (login jaisa)
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
  sameSite: "none",
        });
        res.send({
          success: true,
          msg: "Signup done",
          token,
        });
      });
    }
  } else {
    res.send({
      success: false,
      msg: "sign not done",
    });
  }
});

// ---------- LOGIN ----------
app.post("/login", async (req, res) => {
  const useData = req.body;
  if (useData.email && useData.password) {
    const db = await connection();
    const collection = await db.collection("user");

    const result = await collection.findOne({
      email: useData.email,
      password: useData.password,
    });
    if (result) {
      jwt.sign(useData, "Google", { expiresIn: "1115d" }, (error, token) => {
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
  sameSite: "none",
        });

        res.send({
          success: true,
          msg: "LOGINN done",
        });
      });
    } else {
      // FIX: pehle user na milne par response hi nahi jata tha (request hang ho jati thi)
      res.send({
        success: false,
        msg: "user not found",
      });
    }
  } else {
    res.send({
      success: false,
      msg: "user not found",
    });
  }
});

app.get("/", (req, res) => {
  res.send({
    Message: "api",
    succeess: true,
  });
});

// ---------- TASK APIs (sab protected hain) ----------
app.post("/add-task", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(req.body);
  if (result) {
    res.send({ Message: "new task added", success: true, result });
  } else {
    res.send({ Message: "task not added", success: false });
  }
});

app.get("/tasks", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.find().toArray();
  if (result) {
    res.send({ message: "task list fetched", success: true, result });
  } else {
    res.send({ message: "error try after sometime", success: false });
  }
});

app.get("/tasks/:id", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const id = req.params.id;
  const result = await collection.findOne({ _id: new ObjectId(id) });
  if (result) {
    res.send({ message: "task list fetched", success: true, result });
  } else {
    res.send({ message: "error try after sometime", success: false });
  }
});

app.put("/update-task", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const { _id, ...fields } = req.body;
  const update = { $set: fields };
  console.log(fields);
  const result = await collection.updateOne({ _id: new ObjectId(_id) }, update);
  if (result) {
    res.send({
      message: "taskdata update",
      success: true,
      result,
    });
  } else {
    res.send({ message: "error try after sometime", success: false });
  }
});

app.delete("/delete/:id", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const id = req.params.id;
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result) {
    res.send({ message: "task deleted", success: true, result });
  } else {
    res.send({ message: "error try after sometime", success: false });
  }
});

// ---------- MIDDLEWARE: cookie ka token check karta hai ----------
function verifyJWTToken(req, res, next) {
  const token = req.cookies["token"];
  jwt.verify(token, "Google", (error, decoded) => {
    if (error) {
      return res.send({
        msg: "invalid token",
        succeess: false,
      });
    }
    next();
  });
}

// ---------- SERVER START ----------
const startServer = async () => {
  try {
    await connection();
    console.log("MongoDB Atlas Connected Successfully");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

    // const PORT = process.env.PORT || 3200;
    // app.listen(PORT, () => {
    //   console.log(`Backend running on port ${PORT}`);
    // });
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
  }
};

startServer();
