# Engineer Test

# Purpose

This test is designed to allow the you to demonstrate

- their familiarity with PHP specifically
- full-stack capability
- problem-solving skills

# How you will be assessed

- Tasks are completed to the best of your ability
- Code structure and quality
- Code scalability and performance considerations
- Clear instructions on how to run the application
- Suggest any future improvements you would make if you had unlimited time

# The Test

- Given a CSV file [provided below]
- Make a simple web-based interface which:
    - Accepts the CSV file
    - Imports the CSV file into a database
    - Displays the list of Employees
    - allows the user to edit an Employee’s Email Address
    - Shows the average salary of each company

# Bonus

- Add Unit test(s)
- Use Docker

# The CSV

```
Company Name,Employee Name,Email Address,Salary
ACME Corporation,John Doe,johndoe@acme.com,50000
ACME Corporation,Jane Doe,janedoe@acme.com,55000
ACME Corporation,Bob Smith,bobsmith@acme.com,60000
ACME Corporation,Alice Johnson,alicejohnson@acme.com,65000
Stark Industries,Tony Stark,tony@stark.com,100000
Stark Industries,Pepper Potts,pepper@stark.com,75000
Stark Industries,Happy Hogan,happy@stark.com,60000
Stark Industries,Rhodey Rhodes,rhodey@stark.com,80000
Wayne Enterprises,Bruce Wayne,bruce@wayneenterprises.com,90000
Wayne Enterprises,Alfred Pennyworth,alfred@wayneenterprises.com,50000
Wayne Enterprises,Dick Grayson,dick@wayneenterprises.com,60000
Wayne Enterprises,Barbara Gordon,barbara@wayneenterprises.com,55000
```

# Guidelines

## You must

- Use a relational Database, e.g., MySQL
- Use PHP
- NOT use any 3rd-party PHP libraries for the ORM layer, or CSV handling
- Submit in a new Github repository, and link to it in your email.

## You may

- use plain JavaScript, or any JS framework you’re comfortable with. Our techstack uses VUE

# Troubleshooting

If you’re experiencing a CORS error when setting up your docker environment, you can do the following:

*enable modrewrite in your Dockerfile*

```jsx
RUN a2enmod rewrite
```

*add headers in your index.php file*

```jsx
header("Access-Control-Allow-Origin: *");
```