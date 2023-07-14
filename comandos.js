import fs from "fs";
import mysql from "mysql";
import { exec } from "child_process";

function createDir(directoryPath){
try {
  fs.mkdirSync(`./${directoryPath}`);
} catch (error) {
  
}
}
function createServerFolder(directoryPath) {
  try {
    fs.mkdirSync(`${directoryPath}/server`);
  } catch (err) {
  }
}
function createClientFolder(directoryPath) {
  try {
    fs.mkdirSync(`${directoryPath}/client`);
  } catch (err) {
    
  }
}

function runCommand(command, cwd,log) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: cwd }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
  
        resolve({ stdout, stderr });
      });
    });
  }

export function detectMySQL(user, password, port = 3306) {
  const config = {
    user,
    password,
    port,
  };

  const connection = mysql.createConnection(config);

  return new Promise((resolve) => {
    connection.connect((err) => {
      connection.end();
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function runCommandsOnServerFolder(directoryPath, commands,log) {
  try {
    createDir(directoryPath)
    createServerFolder(directoryPath);

    const serverFolderPath = `${directoryPath}/server`;

    for(const command of commands){
        try {
            await runCommand(command, serverFolderPath, log);
        } catch (error) {
            
        }
    }
        
  } catch (error) {}
}
export async function runCommandsOnClientFolder(directoryPath, commands,log) {
  try {
    createDir(directoryPath)
    createClientFolder(directoryPath);

    const clientPath = `${directoryPath}/client`;

    for(const command of commands){
        try {
            await runCommand(command, clientPath, log);
        } catch (error) {
            
        }
    }
        
  } catch (error) {}
}

