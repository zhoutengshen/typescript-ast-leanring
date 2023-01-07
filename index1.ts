// import {
//   FunctionDeclaration,
//   Identifier,
//   Node,
//   Project,
//   SourceFile,
//   SyntaxKind,
//   ts,
// } from "ts-morph";
// import { join } from "node:path";
// import { renameIdentifier } from "./utils/rename.mjs";
// import { projectRoot } from "./utils/index.mjs";
// import { copyFile } from "node:fs";
// const tsConfigFilePath = join(projectRoot, "tsconfig.json");
// const project = new Project({
//   tsConfigFilePath: tsConfigFilePath,
// });
// const sourceFilePath = join(projectRoot, "test.ts");

// const copyFileSource = project
//   .addSourceFileAtPath(sourceFilePath)
//   .copy(join(projectRoot, "copy-routes.ts"), { overwrite: true });

// const value = copyFileSource.getDefaultExportSymbol()?.getDeclarations()?.[0];
// let defaultExportName = "";
// if (
//   Node.isExportAssignment(value) &&
//   Node.isIdentifier(value.getExpression())
// ) {
//   defaultExportName = value.getExpression().getText();
// }
// console.log(defaultExportName);

// const node = copyFileSource.getVariableDeclarations().find((item) => {
//   return defaultExportName === item.getName();
// });

// const value1 = node?.findReferences()?.[0]
// console.log(value1.);


// // const cc = copyFileSource.getVariableDeclaration(defaultExportName!)
// // console.log(typeof cc);

// copyFileSource.save().then(() => {
//   copyFileSource.formatText();
// });
