import path, { join } from "path";
import { Project, ts, Node, StructureKind } from "ts-morph";
import {
  isExportDefault,
  projectRoot,
  transformWidthState,
} from "./utils/index.mjs";

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

const dept = sourceFile.getExportAssignment((node) => {
  return !node.isExportEquals();
});

let exportDefaultName;
if (dept && dept.getExpression()) {
  const exp = dept.getExpression();
  if (Node.isIdentifier(exp)) {
    exp.rename;
    exportDefaultName = exp.getText();
  }
}
const routesNode = sourceFile.getVariableDeclaration(exportDefaultName);

type MidState = {
  path: string[];
  navHandleName: string;
};
const resultList: MidState[] = [];
transformWidthState<MidState>(routesNode, {
  init: () => ({ path: [], navHandleName: "" }),
  visiting: {
    ObjectLiteralExpression(node, state) {
      if (!ts.isObjectLiteralExpression(node)) {
        return;
      }
      const pathProNode = node.properties.find(
        (item) => item.name?.getText() === "path"
      );
      if (!pathProNode || !ts.isPropertyAssignment(pathProNode)) {
        return;
      }
      const exprValue = pathProNode.initializer.getText();
      const result: MidState = {
        path: [...state.path, exprValue],
        navHandleName: "undefined",
      };
      const handleNameProNOde = node.properties.find(
        (item) => item.name?.getText() === "navHandleName"
      );
      if (
        handleNameProNOde &&
        ts.isPropertyAssignment(handleNameProNOde) &&
        ts.isStringLiteral(handleNameProNOde.initializer)
      ) {
        let handleName = handleNameProNOde.initializer.getText();
        handleName = handleName.replace(/["'`]/g, "");
        Object.assign(result, {
          navHandleName: handleName,
        });
      }
      resultList.push(result);
      return {
        node: node,
        state: result,
      };
    },
  },
});

const getUniqueResultList = () => {
  const cache: Record<string, number> = {};
  return resultList.map(({ navHandleName, path }) => {
    if (!navHandleName) {
      return {
        navHandleName: `handleNav_${Date.now().toString().substring(8)}`,
        path: path,
      };
    }
    if (cache[navHandleName]) {
      cache[navHandleName] = cache[navHandleName] + 1;
      return {
        navHandleName: `${navHandleName}_${cache[navHandleName]}`,
        path,
      };
    } else {
      cache[navHandleName] = 1;
      return {
        navHandleName,
        path,
      };
    }
  });
};

sourceFile.formatText();
sourceFile.save();
