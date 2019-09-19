namespace ts {

    /**
     * To install hooks into the compiler, assign a value to this field before
     * calling any ts APIs.
     */
    // tslint:disable-next-line:variable-name
    export let __hooks__: Hooks | undefined;

    export interface Hooks {
        /** Mutate a new CompilerHost. */
        decorateCompilerHost?: (
            compilerHost: CompilerHost,
            context:
                | Hooks.CreateCompilerHostArguments
                | Hooks.CreateCompilerHostFromProgramHostArguments
                | Hooks.CreateIncrementalCompilerHostArguments
            ) => CompilerHost;
        /** Mutate a new WatchCompilerHost. */
        decorateWatchCompilerHost?: <T extends BuilderProgram>(
            compilerHost: WatchCompilerHost<T>,
            context:
                | Hooks.CreateWatchCompilerHostArguments<T>
            ) => WatchCompilerHost<T>;

    }
    export namespace Hooks {
        export interface CreateCompilerHostArguments {
            method: "createCompilerHost";
            options: CompilerOptions;
            setParentNodes?: boolean;
        }
        export interface CreateCompilerHostFromProgramHostArguments {
            method: "createCompilerHostFromProgramHost";
            host: ProgramHost<any>;
            getCompilerOptions: () => CompilerOptions;
            directoryStructureHost: DirectoryStructureHost;
        }
        export interface CreateIncrementalCompilerHostArguments {
            method: "createIncrementalCompilerHost";
            options: CompilerOptions;
            system: System;
        }
        export interface CreateWatchCompilerHostArguments<T extends BuilderProgram> {
            method: "createWatchCompilerHost";
            system: System;
            createProgram: CreateProgram<T> | undefined;
            reportDiagnostic: DiagnosticReporter;
            reportWatchStatus?: WatchStatusReporter;
        }
    }

    export namespace hooks {
        export const decorateCompilerHost: NonNullable<Hooks["decorateCompilerHost"]> = (host, context) => {
            if (__hooks__ && __hooks__.decorateCompilerHost) {
                return __hooks__.decorateCompilerHost(host, context);
            }
            else {
                return host;
            }
        };
        export const decorateWatchCompilerHost: NonNullable<Hooks["decorateWatchCompilerHost"]> = (host, context) => {
            if (__hooks__ && __hooks__.decorateWatchCompilerHost) {
                return __hooks__.decorateWatchCompilerHost(host, context);
            }
            else {
                return host;
            }
        };
    }
}
