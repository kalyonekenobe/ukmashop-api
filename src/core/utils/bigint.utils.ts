export const configurePrismaBigIntJSONStringifyOutput = () => {
  (BigInt.prototype as any).toJSON = function () {
    return Number(this.toString());
  };
};
