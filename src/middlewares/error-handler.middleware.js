export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // joi에서 발생한 에러 처리
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }

  // 그 밖의 예상치 못한 에러 처리
  return res.status(500).json({
    status: 500,
    message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};

// 조이로 구현할거라 조이부분 찾아보기

//아니면 그냥 안쓰고 이걸로
// export const errorHandler = (err, req, res, next) => {
//     console.error(err);
//     res.status(err.status || 500).json({
//       status: err.status || 500,
//       message: err.message || 'Internal Server Error',
//     });
//   };

// import Joi from 'joi';

// export const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }
//   next();
// };
