﻿#UserManager

This is a small practice project to manipulate user and project data to DynamoDB or retrieve existing data, using AWS Lambda, DynamoDB, S3, SES, CloudFormation and serverless framework.

##API doc

###saveUser

**Path:** /user

**Method:** POST

**Body:**

    {
        "email": "userName@mail.com",
        "userName": "MyUserName",
        "workingAs": "Position",
        "base64image": "stringOfCharacters"
    }
    
Acceptable values for workingAs property are "Senior Developer", "Intermediate Developer", "Junior Developer",
"Intern", "Head Of Development", "Human Resources", "Project Manager", "Project Delivery Manager", "Scrum Master",
"Project Leader", "UX Design", "Junior QA", "Intermediate QA" and "Senior QA".
User name should have more than 4 and less than 25 characters.
Base64image needs to be a picture converted to string of characters using website https://www.base64-image.de/.
Acceptable image extensions are .png and .jpeg.
   
**Response:** 

If operation was successful, response will be:  

	Successfully saved user.
If server is unable to save data, response will be:

    Server error, unable to save user.
If there's an user error, response will reflect that mistake.

    Invalid body!    	
    Missing valid userName field in body
    Missing valid workingAs field in body.
    Missing valid email field in body.
    UserName must be a string.
    UserName must have at least 4 characters.
    UserName must have less than 25 characters.
    Email must be a valid email address.
    Working position must be a string.
    Working position not valid.
    Base64image must be a string.
    Invalid base64 code.

###getUser

**Path:** /user/{email}

**Method:** GET

**Path parameters**

    { userName@endava.com }

**Response:** 
If operation was successful, response will be

    {
        "userName": "someUserName",
        "workingAs": "working position",
        "email": "userName@endava.com",
        "avatarLink": "https://endavans-dev-avatar-bucket.s3.us-east-2.amazonaws.com/someUserName.png"
    }

If no such user exists in data base, response will be:

    User not found.
If operation couldn't be performed due to server error, response will be:

    Unable to get user data.

###updateAvatarLink event
If user uploads image file (possible extensions are .png, .jpg and .jpeg) to endavansdevupdateavatar bucket, specifically in a folder that is named after existing user email, than user
with that email will have it's avatarLink in dynamodb changed to new picture.

###createProject
When project data is successfully saved in dynamodb, team members will get an email notification that they are assigned to that project.

**Path:** /project

**Method:** POST

**Body:**

    {
        "projectNumber": 1234,
        "ProjectName": "someProjectName",
        "clientName": "someClientName",
        "teamMembers": [
        { "email" : "person1@email.com", "position" : "workingPosition" },
        { "email" : "person2@email.com", "position" : "workingPosition" }
        ]
    }
    
    
Acceptable values for position property are "Senior Developer", "Intermediate Developer", "Junior Developer", 
"Intern", "Head Of Development", "Human Resources", "Project Manager", "Project Delivery Manager", "Scrum Master",
"Project Leader", "UX Design", "Junior QA", "Intermediate QA" and "Senior QA".
**Response:** 

If operation was successful, response will be:  

	Successfully created project data.
If server is unable to save data, response will be:

    Server error, unable to save project.
If there's an user error, response will reflect that mistake.

    Invalid body!    	
    Missing project number!
    Missing project name!
    Missing client name!
    Missing list of team members!
    
    Project name must be a string!
    Client name must be a string!
    Project number must be a number!
    Team members must be a list of objects!
    There must be at least one team member.
    Team member must have email to be identified!
    Team member must have position data!
    Team member position is not valid.
    Team member not found!
    Project not found!
    Server error!
    User position doesn't match user position in dynamoDb!

###getProject
**Path:** /project/{projectNumber}

**Method:** GET

**Path parameters**

    { 1234 }

**Response:** 
If operation was successful, response will be

    {
        "projectNumber": 1234,
        "ProjectName": "someProjectName",
        "clientName": "someClientName",
        "teamMembers": [
        { "email" : "person1@email.com", "position" : "workingPosition" },
        { "email" : "person2@email.com", "position" : "workingPosition" }
        ]
    }

If no such project exists in data base, response will be:

    Project not found.
If operation couldn't be performed due to server error, response will be:

    Server error. Unable to get project data.



###deleteProject

**Path:** /project/{projectNumber}

**Method:** DELETE
    
**Response:** 

If operation was successful, response will be:  

	Project data successfully removed!
If server is unable to save data, response will be:

    Server error!
If there's an user error, response will reflect that mistake.

    Please enter project number.   	
    Project must be requested by project number!
    Project not found!

##How to deploy?

First, AWS credentials need to be set. (see: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

Dependencies need to be installed with:

	npm install

Then to deploy, use commands:

	serverless deploy [--stage]
	serverless s3deploy [--stage]

##How to run unit tests?

    npm run tests:unit
    
##How to run integration tests?
For Windows OS:
    
    npm run tests:integration-windows
For Linux OS:

    npm run tests:integration           
