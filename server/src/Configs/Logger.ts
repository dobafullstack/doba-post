import chalk from "chalk";

export default class Logger{
    public static success(content: any){
        console.log(chalk.black.bgGreen(content))
    };

    public static error(content: any){
        console.log(chalk.black.bgRed(content));
    };
}