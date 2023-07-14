#!/usr/bin/env node

import boxen from "boxen";
import { confirm, input } from "@inquirer/prompts";
import {
  detectMySQL,
  runCommandsOnClientFolder,
  runCommandsOnServerFolder,
} from "./comandos.js";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import chalkAnimation from "chalk-animation";

const directory = "./";
let step_one = true;
let step_two = true;

while (step_one) {
  console.clear();

  console.log(
    boxen(
      `[${chalk.green("+")}] MySql Credentialas\n[${chalk.red("-")}] Express framework\n[${chalk.red("-")}] React Framework
    `,
      {
        title:
          "Set Up for " +
          chalk.bgYellow(chalk.black("ExpressJS")) +
          " / " +
          chalk.bgCyan(chalk.black("ReactJS")),
        padding: 1,
      }
    )
  );

  let DB_USER = await input({ message: "What is your mysql user >" });
  let DB_PASSWORD = await input({ message: "What is your mysql password >" });

  const spinner = createSpinner("Checking connection").start();

  const dbConnected = await detectMySQL(DB_USER, DB_PASSWORD);

  if (dbConnected) {
    spinner.success();
    step_one = false;

    let DB_NAME = await input({ message: "Name your new database project >" });

    const spinnerGit = createSpinner("Installing Express !").start();

    await runCommandsOnServerFolder(directory, [
      "git clone https://github.com/pgap22/3-layers-template-api.git .",
      `echo DATABASE_URL='mysql://${DB_USER}@${DB_PASSWORD}:localhost:3306/${DB_NAME} > ./.env`,
    ]);

    spinnerGit.success();

    console.log(chalk.bgYellow(chalk.black("NOTE: It can take a few minutes")));

    const spinnerDependencies = createSpinner(
      "Installing Dependencies..."
    ).start();

    await runCommandsOnServerFolder(directory, ["npm i"]);

    spinnerDependencies.success({ text: "Dependencies installed !" });
  } else {
    spinner.error({ text: "Wrong mysql credentials !" });
    const dbContinue = await confirm({ message: "Change credentials ?" });
    if (!dbContinue) {
      step_one = false;
    }
  }
}

if (step_one) {
  process.exit();
}

console.clear();

while (step_two) {
  console.log(
    boxen(
      `[${chalk.green("+")}] MySql Credentialas\n[${chalk.green("+")}] Express framework\n[${chalk.green("+")}] React Framework`,
      {
        title:
          "Set Up for " +
          chalk.bgYellow(chalk.black("ExpressJS")) +
          " / " +
          chalk.bgCyan(chalk.black("ReactJS")),
        padding: 1,
      }
    )
  );

  const spinnerReact = createSpinner("Installing React !", {
    color: "cyan",
  }).start();

  await runCommandsOnClientFolder(directory, [
    "git clone https://github.com/pgap22/react-cli-template.git .",
    `echo VITE_API=http://localhost:4000/api/v1 > ./.env`,
  ]);

  spinnerReact.success({ text: "React installed !" });

  const spinnerDependencies = createSpinner(
    "Installing Dependencies..."
  ).start();

  await runCommandsOnClientFolder(directory, ["npm i"]);

  spinnerDependencies.success({ text: "Dependencies installed !" });

  console.log("");
  console.log("All done!");
  console.log("");
  
  console.log(chalk.bgYellow(chalk.black("ExpressJS")));
  console.log("> cd server");
  console.log("> code .");
  console.log("> npm run dev");
  console.log("");
  
  console.log(chalk.bgCyan(chalk.black("ReactJS")));
  console.log("> cd client");
  console.log("> code .");
  console.log("> npm run dev");
  
  console.log("");
  chalkAnimation.karaoke("Happy Coding !!");

  setTimeout(()=>{
    console.log(":)")
  },2000)
  step_two = false;
}
