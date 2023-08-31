## Title:
 Student Repository Modification Challenge

### Introduction + Scenario: 
In the context of building a student management project, we need participants to modify the provided repository file. This file handles database interactions for student data. By making the necessary adjustments to the repository, participants will enhance its functionality, ensuring effective data management for the student application.

### Objectives: 
Your task is to update the studentRepository class to implement the following methods, each serving a specific purpose within the student management project:

1. createIndexes: Enhance the method to create database indexes that optimize querying performance. Implement two types of indexes: a single-field index on the 'name' field (ascending) and a compound index on the 'age' field (ascending) and 'grade' field (descending).

2. getStudentsWithAverageScore: Update the method to calculate the average score for each student using the MongoDB aggregation pipeline. The output should include the student's name and their calculated average score.

3. getQualifiedStudentsCount: Adjust the method to determine the count of students who meet specific criteria. Only include students with an age greater than 9, a grade less than or equal to 'B', an assignment titled 'math', and a score of 60 or higher.

4. awardExtraCredit: Modify the method to award additional credit points to a specific student. Use the provided studentId and extraCreditPoints parameters to calculate the updated scores for the student's assignments. Update the database with the new assignment scores, ensuring proper transaction management.

### Expected Output: 

Output should look like: https://files.codingninjas.in/14_4-30632.gif

Participants should modify the studentRepository class to incorporate the provided methods according to the given specifications. The methods should interact with the database as outlined and produce the intended outcomes.

### Requirements:
 Utilize the provided MongoDB utility functions (getClient and getDB) for database connectivity. For the createIndexes method, create a single-field index on the 'name' field in ascending order and a compound index on the 'age' field in ascending order and the 'grade' field in descending order.

### Notes/Hints: 
Consider using MongoDB aggregation pipeline operations for advanced querying. Refer to the provided code for hints on interacting with the database and calculating updated scores.
