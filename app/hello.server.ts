export const sayHello = (req, res, next) => {
  console.log("hello");
  next();
};
