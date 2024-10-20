import { useEffect, useRef, useState } from "react";
import Input from "./Input";
import Select from "./Select";
import { JOB_POSITIONS } from "../../consts/jobPositions.const";
import Dialog from "../UI/Dialog";
import { validationSchema } from "../../validations/form.validation";
import MemberCard from "../UI/MemberCard";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  jobPosition: "",
  linkedin: "",
  github: "",
};

const Form = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const isFirstRender = useRef(true);

  const validateField = async (name, value) => {
    try {
      await validationSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (validationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationError.message,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      saveForm();
    } catch (validationErrors) {
      setErrors(formatErrors(validationErrors));
    }
  };

  const saveForm = () => {
    sessionStorage.setItem("memberData", JSON.stringify(formData));
    setErrors({});
    setDialogOpen(true);
    isFirstRender.current = true;
  };

  const formatErrors = (validationErrors) => {
    return validationErrors.inner.reduce(
      (acc, error) => ({
        ...acc,
        [error.path]: error.message,
      }),
      {}
    );
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setRegistered(true);
    setFormData(initialFormData);
  };

  const newRegister = () => {
    setRegistered(false);
  };

  useEffect(() => {
    validationSchema
      .validate(formData, { abortEarly: false })
      .catch((validationErrors) => setErrors(formatErrors(validationErrors)));
    isFirstRender.current = false;
  }, [formData]);

  return (
    <div className="py-10">
      {!registered && (
        <section className="card">
          <div className="card-label">
            <h1 className="card-title">Cadastro de membros</h1>
          </div>
          <p className="text-left mb-5">
            <span className="text-primary-default mr-2 align-bottom">*</span>
            <span className="opacity-50">Campos obrigatórios</span>
          </p>
          <form onSubmit={handleSubmit} data-testid="form" className="form">
            <Input
              required
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              label="Nome completo"
              type="text"
              name="fullName"
              placeholder="Digite seu nome completo"
            />
            <Select
              required
              options={JOB_POSITIONS}
              value={formData.jobPosition}
              onChange={handleChange}
              error={errors.jobPosition}
              label="Cargo Pretendido"
              placeholder="Selecione o cargo pretendido"
              name="jobPosition"
            />
            <Input
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              label="E-mail"
              type="email"
              name="email"
              placeholder="exemplo@email.com"
            />
            <Input
              required
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              label="Telefone"
              type="tel"
              name="phone"
              placeholder="(xx) xxxxx-xxxx"
            />
            <Input
              value={formData.linkedin}
              onChange={handleChange}
              error={errors.linkedin}
              label="LinkedIn"
              type="url"
              name="linkedin"
              placeholder="https://www.linkedin.com/in/exemplo"
            />
            <Input
              value={formData.github}
              onChange={handleChange}
              error={errors.github}
              label="Github"
              type="url"
              name="github"
              placeholder="https://github.com/exemplo"
            />
            {isDialogOpen && (
              <Dialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                title="Cadastro efetuado"
              >
                <p>Você foi cadastrado com sucesso!</p>
                <button type="button" onClick={closeDialog} className="button">
                  Fechar
                </button>
              </Dialog>
            )}
            <div className="md:col-start-2">
              <button type="submit" className="button float-right w-full">
                Cadastrar
              </button>
            </div>
          </form>
        </section>
      )}
      {registered && <MemberCard onClose={newRegister} />}
    </div>
  );
};

export default Form;
