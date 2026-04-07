const sendResponse = (res, statusCode = 200, data, message) => {
  const responseBody = {
    status: "success",
    message,
    // If data is an array, automatically include a 'results' count
    ...Array.isArray(data) && { results: data.length },
    data
  };
  return res.status(statusCode).json(responseBody);
};
export {
  sendResponse
};
