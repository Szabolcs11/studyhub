import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().required("Ez a mező kötelező!"),
  password: yup.string().required("A jelszó mező kötelező!"),
});

export const registerSchema = yup.object().shape({
  nickname: yup.string().min(6, "A mezőnek tartalmaznia kell legalább 6 karaktert").required("Ez a mező kötelező!"),
  email: yup
    .string()
    .min(6, "A mezőnek tartalmaznia kell legalább 6 karaktert")
    .required("Ez a mező kötelező!")
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Nem megfelelő email!"),
  password: yup.string().min(8, "A mezőnek tartalmaznia kell legalább 8 karaktert").required("Ez mező kötelező!"),
  passwordagain: yup
    .string()
    .min(8, "A mezőnek tartalmaznia kell legalább 8 karaktert")
    .oneOf([yup.ref("password")], "A jelszavak nem egyeznek")
    .required("Ez mező kötelező!"),
});
