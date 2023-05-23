import express from "express";
import mongoose from 'mongoose'

import { studentsData } from "./data.js";
const app = express()
app.use(express.json())

//connect to mongoose
mongoose.connect(
  // 'mongodb+srv://tanmayg2102:travis790@cluster0.ww1wbiw.mongodb.net/Students2?retryWrites=true&w=majority'
  'mongodb+srv://tanmayg2102:hipe@hipe.q6rj342.mongodb.net/student?retryWrites=true&w=majority'
).then(()=>{
  console.log("mongoDB connected")
})

//create new structure fro students in mongo

const studentSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  CC_Marks: Number,
  AI_marks: Number,
});

const Student  = mongoose.model("studentmarks",studentSchema);



// Add data
app.get("/addData",async(req,res)=>{
  try{
    await Student.insertMany(studentsData);
    res.send("Data Added");
  }catch(err){
    res.send(err)
  }
})

// Display data
app.get('/getStudents',async(req,res)=>{
  try{
    const count = await Student.countDocuments();
    const students = await Student.find();
    const tablerows = students.map((student)=>{
      return `
      <tr>
      <td>${student.Name}</td>
      <td>${student.Roll_No}</td>
      <td>${student.WAD_Marks}</td>
      <td>${student.DSBDA_Marks}</td>
      <td>${student.CNS_Marks}</td>
      <td>${student.CC_Marks}</td>
      <td>${student.AI_marks}</td>
    </tr>
      `
    })
    const table = `
      <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>RollNo</th>
        <th>WAD</th>
        <th>DSBDA</th>
        <th>CNS</th>
        <th>CC</th>
        <th>AI</th>
      </tr>
      </thead>
      <tbody>
        ${tablerows.join("")}
      </tbody>
      </table>
    `
    res.send(`Total Count : ${count} <br><br>${table}`);
  }catch(err){
    res.send(err)
  }
})

// //e . List the names of students who got more than 20 marks in DSBDA
// // Subject in browser.
app.get("/dsbda",async(req,res)=>{
  try{
    const students = await Student.find({DSBDA_Marks : {$gt : 20}})
    // const studentNames = students.map( std => std.Name)
    // res.send(studentNames)
    res.send(students)
  }catch(err){
    res.send(err)
  }
})

// // More than 25 in all

app.get('/more25',async(req,res)=>{
  try{
    const students = await Student.find({
      DSBDA_Marks : {$gt : 25},
      CC_Marks : {$gt : 25},
      WAD_Marks : {$gt :25},
      CNS_Marks : {$gt : 25}
    })
    res.send(students)

  }catch(err){
    res.send(err)
  }
})

// // List the names who got less than 40 in both Maths and Science in
// // browser.

app.get('/less',async(req,res)=>{
  try{
    const students = await Student.find({
      DSBDA_Marks:{$lt:40},
      CNS_Marks :{$lt : 40}
    })
    res.send(students);
  }catch(err){
    res.send(err)
  }
})

// // delete

app.get("/delete/:roll",async(req,res)=>{
  try {
    const {roll} = req.params
    const student = await Student.deleteOne({Roll_No : roll})
    
    if(student)res.send("deleted")
    else res.send("failed")
  } catch (error) {
    res.send(error)
  }
})

app.listen(4000,()=>{

  console.log("server connected")
})