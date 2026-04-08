import express from "express";
/**
 * @param {express.Handler} fn
 * @returns {express.Handler} 
*/
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
var catchAsync_default = catchAsync;
export default catchAsync
