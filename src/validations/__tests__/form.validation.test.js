import { validationSchema } from "../form.validation";
import { describe, expect, test } from "vitest";

const validData = {
  fullName: "Sarah Almeida",
  email: "sarah@example.com",
  phone: "(11) 99999-9999",
  jobPosition: "developer",
  linkedin: "https://www.linkedin.com/in/teste",
  github: "https://github.com/teste",
};

const invalidLinkedinData = {
  ...validData,
  linkedin: "https://teste.com.br",
};

const invalidGithubData = {
  ...validData,
  github: "https://teste.com.br",
};

const missingFieldData = {
  fullName: "",
  email: "",
  phone: "",
  jobPosition: "",
  linkedin: "",
  github: "",
};

describe("Validation Schema", () => {
  test("should pass validation with valid data", async () => {
    const isValid = await validationSchema.isValid(validData);
    expect(isValid).toBe(true);
  });

  test("should fail validation if a required field is missing", async () => {
    try {
      await validationSchema.validate(missingFieldData, { abortEarly: false });
    } catch (err) {
      expect(err.errors).toEqual([
        "Nome completo é obrigatório",
        "E-mail é obrigatório",
        "Telefone é obrigatório",
        "Cargo pretendido é obrigatório",
      ]);
    }
  });

  test("should fail validation with invalid LinkedIn URL", async () => {
    try {
      await validationSchema.validate(invalidLinkedinData);
    } catch (err) {
      expect(err.errors).toContain('A URL deve começar com "https://www.linkedin.com/in/"');
    }
  });

  test("should fail validation with invalid GitHub URL", async () => {
    try {
      await validationSchema.validate(invalidGithubData);
    } catch (err) {
      expect(err.errors).toContain('A URL deve começar com "https://github.com/"');
    }
  });

  test("should fail validation with invalid email format", async () => {
    const invalidEmailData = { ...validData, email: "invalid-email" };
    try {
      await validationSchema.validate(invalidEmailData);
    } catch (err) {
      expect(err.errors).toContain("Formato de e-mail inválido");
    }
  });

  test("should not validate LinkedIn or GitHub URLs if they are empty", async () => {
    const dataWithoutUrls = { ...validData, linkedin: "", github: "" };
    const isValid = await validationSchema.isValid(dataWithoutUrls);
    expect(isValid).toBe(true);
  });
});
