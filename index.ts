import { ObjectLiteralExpression, Project, Node } from "ts-morph";
import { join } from "node:path";
import { fileURLToPath } from "url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const tsConfig = join(projectRoot, "tsconfig.json");
const project = new Project({
  tsConfigFilePath: tsConfig,
});

const sourceFilePath = join(projectRoot, "routes.ts");
const copySourceFileAst = project
  .addSourceFileAtPath(sourceFilePath)
  .copy(join(projectRoot, "new.ts"), { overwrite: true });
const exportDeclarations = copySourceFileAst.getExportedDeclarations();

type RouteProto = keyof Route;
interface Route {
  path?: string;
  component?: string;
  children?: Route[];
}
const getValue = (
  target: ObjectLiteralExpression,
  fatherPath = ""
): Route | null => {
  if (!target) {
    return null;
  }
  const result: Route = {};
  target.getProperties().forEach((item) => {
    // @ts-ignore
    const name = item.getName() as RouteProto;
    if (name === "path") {
      // @ts-ignore
      const initializer = item.getInitializer();
      if (Node.isStringLiteral(initializer)) {
        const originText = initializer.getText().replace(/"(.+)"/, "$1");
        result.path = join(fatherPath, originText).replace(/\\/g, "/");
      }
      if (Node.isIdentifier(initializer)) {
      }
    } else if (name === "children") {
      // @ts-ignore
      const initializer = item.getInitializer();
      if (Node.isArrayLiteralExpression(initializer)) {
        initializer.forEachChild((item) => {
          if (Node.isObjectLiteralExpression(item)) {
            const arrItemResult = getValue(item, result.path);
            if (result.children && arrItemResult) {
              result.children.push(arrItemResult);
            } else if (!result.children && arrItemResult) {
              result.children = [arrItemResult];
            }
          }
        });
      }
    }
  });
  return result;
};

exportDeclarations.forEach((declarations, name) => {
  if (name !== "default") {
    return;
  }
  declarations.forEach((item) => {
    // @ts-ignore
    const initializer = item?.getInitializer() as ObjectLiteralExpression;
    if (!initializer) {
      return;
    }
    const result = getValue(initializer);
    console.log(result);
  });
});

copySourceFileAst.save();
