// const sourceFile = project
//   .addSourceFileAtPath(join(projectRoot, "root-files", "test.ts"))
//   .copy(join(projectRoot, "root-files", "test1.ts"), { overwrite: true });
// const result = {};
// let midState: Record<string, any> = result;
// sourceFile.transform((ttc) => {
//   const oldMidState = midState;
//   const child: Record<string, any> = {};
//   if (midState["path"]) {
//     // 子节点访问
//     child["path"] = `${midState["path"]}-`;
//     midState["child"] = [...(midState["child"] || []), child];
//     midState = child;
//   } else {
//     // 初始化
//     midState["path"] = "-";
//     midState["child"] = [];
//   }
//   const oneNode = ttc.visitChildren();
//   // 当前节点访问结束
//   midState = oldMidState;
//   return oneNode;
// });
