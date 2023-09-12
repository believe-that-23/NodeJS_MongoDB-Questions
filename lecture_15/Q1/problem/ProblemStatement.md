### Title:
MongoDB Schema Validation with Mongoose

## Introduction + Scenario:
You are tasked with implementing MongoDB schema validation using Mongoose, a widely used Node.js library for MongoDB. Imagine you are building a library management system, and you need to define the schema for books in your database. Your task is to create a Mongoose schema for books and establish a successful connection to MongoDB.

## Objectives:
1. Establish a MongoDB connection using Mongoose to a local database at "mongodb://localhost:27017".

2. Create a Mongoose schema named bookSchema for books based on a configuration object. The configuration object should include information about the fields and their constraints. Your schema should include the following fields:

 - title: This field will store book titles and is mandatory.
 - author: This field will store the author's information as an ObjectID reference to 'Author' and is mandatory.
 - genre: This field will store the genre of the book and is mandatory. It should be one of ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Fantasy', 'Other'].
 - copies: This field will store the total number of copies available for the book and is mandatory. It should have a minimum value of 1.
 - availableCopies: This field will store the number of available copies for the book and is mandatory. It should have a minimum value of 0.

## Expected Output:
Ensure that your Mongoose schema (bookSchema) is correctly defined based on the provided configuration object. Your program should successfully connect to MongoDB and display "MongoDB connected using mongoose" in the console upon a successful connection.

## Requirements:

Use Node.js and Mongoose to solve this problem.
You are not required to implement the 'Author' schema for this task.
Make sure to handle any potential errors that may occur during the MongoDB connection.

## Resources:
Mongoose documentation: https://mongoosejs.com/

## Notes/Hints:
No need to change prewritten code.
You can pass a configuration object to define your schema fields and constraints.
Pay close attention to the field types, requirements, and constraints specified in the objectives. Use the Mongoose documentation for reference.