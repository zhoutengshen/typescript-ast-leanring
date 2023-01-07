import { ts } from "ts-morph";

export const renameIdentifier = <T extends ts.VariableDeclaration>(
  node: T,
  replace: (originName: ts.__String) => string = (o: ts.__String) =>
    o.toString()
) => {
  if (!ts.isIdentifier(node.name)) {
    return node;
  }
  const newName = replace(node.name.escapedText);
  return ts.factory.updateVariableDeclaration(
    node,
    ts.factory.createIdentifier(`${newName}`),
    node.exclamationToken,
    node.type,
    node.initializer
  );
};
