const inquirer=require("inquirer");
const fs=require("fs");
const Manager=require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern=require("./lib/Intern");

const team=[];

function initApp(){
    startGenerateHtml();
    buildTeam();
    
     
}

function buildTeam() {
    inquirer.prompt([{
        message: "Enter team member's name :",
        name: "name",
        validate: answer => {
            if (answer !== "") {
              return true;
            }
            return "Please enter team member's name.";
          }
    },
    {
        type: "list",
        message: "Select team member's role : ",
        choices: [
            "Engineer",
            "Intern",
            "Manager"
        ],
        name: "role"
    },
    {
        message: "Enter team member's id : ",
        name: "id",
        validate: answer => {
            const pass = answer.match(
              /^[1-9]\d*$/
            );
            if (pass) {
              return true;
            }
            return "Please enter a positive number greater than zero.";
          }
    },
    {
        message: "Enter team member's email address : ",
        name: "email",
        validate: answer => {
            const pass = answer.match(
              /\S+@\S+\.\S+/
            );
            if (pass) {
              return true;
            }
            return "Please enter a valid email address.";
          }
    }])
    .then(function({name, role, id, email}) {
        let roleInfo = "";
        if (role === "Engineer") {
            roleInfo = "GitHub username";
        } else if (role === "Intern") {
            roleInfo = "school name";
        } else {
            roleInfo = "office phone number";
        }
        inquirer.prompt([{
            message: `Enter team member's ${roleInfo}`,
            name: "roleInfo",
            validate: answer => {
                if (answer !== "") {
                  return true;
                }
                return `Please enter team member's ${roleInfo}`;
              }
        },
        {
            type: "list",
            message: "Would you like to add more team members?",
            choices: [
                "yes",
                "no"
            ],
            name: "moreMembers"
        }])

        .then(function({roleInfo, moreMembers}) {
            let newMember;
            if (role === "Engineer") {
                newMember = new Engineer(name, id, email, roleInfo);
            } else if (role === "Intern") {
                newMember = new Intern(name, id, email, roleInfo);
            } else {
                newMember = new Manager(name, id, email, roleInfo);
            }
           team.push(newMember);
            addHtml(newMember)
            .then(function() {
                if (moreMembers === "yes") {
                    buildTeam();
                } else {
                    finishgeneratehHtml();
                }
            });
            
        });
    });
}

function  startGenerateHtml(){
    const html=`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>My Team</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="style.css">
        <script src="https://kit.fontawesome.com/c502137733.js"></script>
    </head>
    
    <body>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 text-center bg-primary my-5 py-5 display-4 text-white">
                    <h1 class="text-center">My Team</h1>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">`;
            fs.writeFile("./output/team.html",html,function(err){
                if(err) {
                    console.log("This is the error",err);
                }

});
}

function finishgeneratehHtml(){
    const html = ` </div>
    </div>
    
</body>
</html>`;

    fs.appendFile("./output/team.html", html, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log("end");
}
function addHtml(teamMember){
    return new Promise (function(resolve, reject){
        const name = teamMember.getName();
        const role = teamMember.getRole();
        const id = teamMember.getId();
        const email = teamMember.getEmail();
        let data = "";
        if (role === "Engineer") {
            const gitHub = teamMember.getGithub();
            data = `<div class="col-4">
            <div class="card mx-auto border-primary  mb-3" style="max-width: 18rem;">
            <div class="card-header text-center h4">${name}</div>
            <div class="card-header text-center h6"><i class="fas fa-cogs"></i>${role}</div>
            <div class="card-body text-primary">
            <p class="card-text">ID: ${id}</p>
            <p class="card-text">Email Address: ${email}</p>
            <p class="card-text">GitHub: ${gitHub}</p>
            </div>
            </div>
        </div>`;
        }
        else if( role === "Manager"){

            const officePhone = teamMember.getOfficeNumber(); 
            data = `<div class="col-4">
            <div class="card mx-auto border-primary  mb-3" style="max-width: 18rem">
            <div class="card-header text-center h4">${name}</div>
            <div class="card-header text-center h6"><i class="fas fa-users"></i>${role}</div>
            <div class="card-body text-primary">
            <p class="card-text">ID: ${id}</p>
            <p class="card-text">Email Address: ${email}</p>
            <p class="card-text">Office Phone: ${officePhone}</p>
            </div>
            </div>
        </div>`;
        }
        else
        {
            const school=teamMember.getSchool();
            data = `<div class="col-4">
            <div class="card mx-auto border-primary  mb-3" style="max-width: 18rem">
            <div class="card-header text-center h4">${name}</div>
            <div class="card-header text-center h6"><i class="fas fa-user-graduate"></i>${role}</div>
            <div class="card-body text-primary">
            <p class="card-text">ID: ${id}</p>
            <p class="card-text">Email Address: ${email}</p>
            <p class="card-text">School: ${school}</p>
            </div>
            </div>
        </div>`
        }
        fs.appendFile("./output/team.html", data, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });
    
}
initApp();
