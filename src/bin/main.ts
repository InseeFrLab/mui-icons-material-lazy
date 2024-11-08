#!/usr/bin/env node

import { termost } from "termost";
import { readThisNpmPackageVersion } from "./tools/readThisNpmPackageVersion";
import { getAbsoluteAndInOsFormatPath } from "./tools/getAbsoluteAndInOsFormatPath";
import { ICONS_DIR_BASENAME } from "./constants";

type CliCommandOptions = {
    projectDirPath: string | undefined;
};

function parseCliCommandOptions(cliCommandOptions: CliCommandOptions) {
    const { projectDirPath } = cliCommandOptions;

    return {
        projectDirPath:
            projectDirPath === undefined
                ? process.cwd()
                : getAbsoluteAndInOsFormatPath({ cwd: process.cwd(), pathIsh: projectDirPath })
    };
}

const program = termost<CliCommandOptions>(
    {
        name: "mui-icons-material",
        description: "mui-icons-material-lazy CLI",
        version: readThisNpmPackageVersion()
    },
    {
        onException: error => {
            console.error(error);
            process.exit(1);
        }
    }
);

const optionsKeys: string[] = [];

program.option({
    key: "projectDirPath",
    name: (() => {
        const long = "project";
        const short = "p";

        optionsKeys.push(long, short);

        return { long, short };
    })(),
    description: [
        `For monorepos, path to the keycloakify project.`,
        "Example: `npx mui-icons-material postinstall --project packages/frontend`"
    ].join(" "),
    defaultValue: undefined
});

function skip(_context: any, argv: { options: Record<string, unknown> }) {
    const unrecognizedOptionKey = Object.keys(argv.options).find(key => !optionsKeys.includes(key));

    if (unrecognizedOptionKey !== undefined) {
        console.error(
            `keycloakify: Unrecognized option: ${
                unrecognizedOptionKey.length === 1 ? "-" : "--"
            }${unrecognizedOptionKey}`
        );
        process.exit(1);
    }

    return false;
}

program
    .command({
        name: "postinstall",
        description: [
            `Will create a ${ICONS_DIR_BASENAME} directory in your public directory.`,
            `If you are in a Vite project it will read your vite config to get the location of your public directory.`,
            `By default it's public/.`,
            `If it's not a Vite project and a public/ directory exists it will use it.`,
            `If you are in a monorepo and not running the command from the root of the Vite/Create-React-App project,`,
            `use the --project option to specify the path to the project.`
        ].join(" ")
    })
    .task({
        skip,
        handler: async cliCommandOptions => {
            const { projectDirPath } = parseCliCommandOptions(cliCommandOptions);

            const { command } = await import("./postinstall");

            await command({ projectDirPath });
        }
    });
