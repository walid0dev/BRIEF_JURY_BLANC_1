const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
var catchAsync_default = catchAsync;
export {
  catchAsync_default as default
};
