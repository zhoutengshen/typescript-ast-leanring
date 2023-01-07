import { join } from "path";
import { Project, ts } from "ts-morph";
import { projectRoot, transformWidthState } from "./utils/index.mjs";

const project = new Project({
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    lib: ["DOM", "ES2015"],
    target: ts.ScriptTarget.ES2015,
    outDir: join(projectRoot, "dist"),
  },
});
const sourceFile = project
  .addSourceFileAtPath(join(projectRoot, "root-files", "test.ts"))
  .copy(join(projectRoot, "root-files", "test1.ts"), { overwrite: true });

transformWidthState<number>(sourceFile, {
  init: () => 1,
  visiting: {
    each(node, state) {
      return {
        state: state + 1,
        node,
      };
    },
    ExportAssignment(node, state) {
      console.log(state);
    },
  },
});
