import * as Yup from "yup";

const nameIsRequired = "Nome completo é obrigatório";
const phoneIsRequired = "Telefone é obrigatório";
const emailIsRequired = "E-mail é obrigatório";
const jobPositionIsRequired = "Cargo pretendido é obrigatório";
const emailIsInvalid = "Formato de e-mail inválido";
const urlIsInvalid = "URL inválida";
const githubUrlIsInvalid = 'A URL deve começar com "https://github.com/"';
const linkedinUrlIsInvalid =
  'A URL deve começar com "https://www.linkedin.com/in/"';
const linkedinUrlPattern = /^https:\/\/www\.linkedin\.com\/in\//;
const githubUrlPattern = /^https:\/\/github\.com\//;

const linkedInValidation = (value, ctx) => {
  if (value.length > 0 && !linkedinUrlPattern.test(value)) {
    return ctx.createError({ message: linkedinUrlIsInvalid });
  }
  return true;
};

const githubValidation = (value, ctx) => {
  if (value.length > 0 && !githubUrlPattern.test(value)) {
    return ctx.createError({ message: githubUrlIsInvalid });
  }
  return true;
};

export const validationSchema = Yup.object({
  fullName: Yup.string().required(nameIsRequired),
  email: Yup.string().email(emailIsInvalid).required(emailIsRequired),
  phone: Yup.string().required(phoneIsRequired),
  jobPosition: Yup.string().required(jobPositionIsRequired),
  linkedin: Yup.string().url(urlIsInvalid).test("linkedin-is-valid", linkedinUrlIsInvalid, linkedInValidation),
  github: Yup.string().url(urlIsInvalid).test("github-is-valid", githubUrlIsInvalid, githubValidation),
});
