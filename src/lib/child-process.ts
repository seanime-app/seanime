export function runCommand(command: string) {
    require("child_process").exec(command)
}
