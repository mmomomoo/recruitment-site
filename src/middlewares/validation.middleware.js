import Joi from 'joi';

export const validateSignUp = (req, res, next) => {
  const signUpSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': '이메일 형식이 올바르지 않습니다.',
      'any.required': '이메일을 입력해 주세요.',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': '비밀번호는 6자리 이상이어야 합니다.',
      'any.required': '비밀번호를 입력해 주세요.',
    }),
    passwordConfirm: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': '입력 한 두 비밀번호가 일치하지 않습니다.',
        'any.required': '비밀번호 확인을 입력해 주세요.',
      }),
    name: Joi.string().required().messages({
      'any.required': '이름을 입력해 주세요.',
    }),
  });

  const { error } = signUpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
