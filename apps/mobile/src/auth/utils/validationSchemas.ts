import * as Yup from 'yup';

// Password at least 8 chars, one uppercase, one lowercase, one number, one special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;

// Cambodia phone number regex
const phoneRegex = /^(\\+855|0)[1-9]\\d{7,8}$/;

// Login validation schema
export const loginSchema = Yup.object().shape({
    email: Yup.string()
    .email('Please enter a valid email')
    .when('phone', {
        is: (phone: string) => !phone || phone.length === 0,
        then: (schema) => schema.required('Email or phone is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    phone: Yup.string()
    .matches(phoneRegex, 'Please enter a valid phone number')
    .when('email', {
      is: (email: string) => !email || email.length === 0,
      then: (schema) => schema.required('Email or phone is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Register validation schema
export const registerSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Please enter a valid email')
      .when('phone', {
        is: (phone: string) => !phone || phone.length === 0,
        then: (schema) => schema.required('Email or phone is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    phone: Yup.string()
      .matches(phoneRegex, 'Please enter a valid phone number')
      .when('email', {
        is: (email: string) => !email || email.length === 0,
        then: (schema) => schema.required('Email or phone is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    password: Yup.string()
      .required('Password is required')
      .matches(
        passwordRegex,
        'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      ),
    password_confirmation: Yup.string()
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  // OTP verification schema
export const otpVerificationSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(phoneRegex, 'Please enter a valid phone number')
      .required('Phone number is required'),
    code: Yup.string()
      .required('OTP code is required')
      .matches(/^\\d{6}$/, 'OTP must be 6 digits'),
  });
  
  // Guest to user migration schema
  export const guestToUserSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Please enter a valid email')
      .when('phone', {
        is: (phone: string) => !phone || phone.length === 0,
        then: (schema) => schema.required('Email or phone is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    phone: Yup.string()
      .matches(phoneRegex, 'Please enter a valid phone number')
      .when('email', {
        is: (email: string) => !email || email.length === 0,
        then: (schema) => schema.required('Email or phone is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    password: Yup.string()
      .required('Password is required')
      .matches(
        passwordRegex,
        'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      ),
    password_confirmation: Yup.string()
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });
