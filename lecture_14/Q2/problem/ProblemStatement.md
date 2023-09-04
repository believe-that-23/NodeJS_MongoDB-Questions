## Title: Aggregating Expense Data with MongoDB

### Introduction + Scenario:
You are tasked with developing a feature for an expense tracking application. The application has existing routes and controllers for managing expenses, including creating, retrieving, updating, and deleting expenses. Your objective is to enhance the application's functionality by implementing MongoDB aggregation operators to provide valuable insights into the expense data. This will allow users to perform various analyses on their expenses, such as calculating total expenses for each product, grouping expenses by specific criteria, and more.

### Objectives:
1. Utilize MongoDB aggregation operators to aggregate and analyze expense data.
2. Implement aggregation stages to calculate the total revenue for each product.
3. Group expenses by specific criteria, such as tags or recurring status.
4. Provide concise and meaningful data insights to users.

### Expected Output:

Output should look like https://files.codingninjas.in/14_2-30252.gif

Upon successful completion, users should be able to query the application's endpoints to retrieve aggregated expense data based on various criteria. This may include calculated totals, grouped results, and customized analyses.

### Requirements:


1. Ensure you have the MongoDB database connection properly configured.
2. Use the provided controller, model, repository, and routes files to build upon.

### Resources:
- MongoDB documentation on aggregation framework and operators.

### Problem Statement:
You are required to enhance the existing expense tracking application with the following features using MongoDB aggregation operators:

1. Calculate Total Revenue:
Implement an aggregation stage that calculates the total revenue for each unique product based on the "product," "quantity," and "price" fields. The aggregated results should include the product name and its corresponding total revenue.

2. Group Expenses by Tags:
Create an aggregation stage that groups expenses by their "tags" field. Return the total count of expenses in each tag group, along with the tag name.

3. Filter and Group by Recurring Status:
Implement an aggregation stage that groups expenses by their "isRecurring" status (true or false). For each group, calculate the total count of expenses and their average amount.


### Notes/Hints:
- No need to change the default code, changes are meant to be done in repository file only.
- Remember to use the MongoDB aggregation pipeline and relevant stages to achieve the desired results.
- Check the MongoDB documentation for specific syntax and usage of aggregation operators.
- Test your solution thoroughly with different data scenarios to ensure accurate and reliable results.

