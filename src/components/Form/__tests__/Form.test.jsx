import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import Form from "../Form";

const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();

describe("Form Component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage,
    });
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
  });

  test("Deve renderizar o formulário com todos os campos", () => {
    render(<Form />);

    assert.exists(screen.getByTitle("Nome completo"));
    assert.exists(screen.getByTitle("E-mail"));
    assert.exists(screen.getByTitle("Telefone"));
    assert.exists(screen.getByTitle("Cargo Pretendido"));
    assert.exists(screen.getByTitle("LinkedIn"));
    assert.exists(screen.getByTitle("Github"));
  });

  test("Deve renderizar o formulário com todos os campos", () => {
    render(<Form />);

    assert.exists(screen.getByTitle("Nome completo"));
    assert.exists(screen.getByTitle("E-mail"));
    assert.exists(screen.getByTitle("Telefone"));
    assert.exists(screen.getByTitle("Cargo Pretendido"));
    assert.exists(screen.getByTitle("LinkedIn"));
    assert.exists(screen.getByTitle("Github"));
  });

  test("Deve mostrar mensagens de validação para e-mail e URLs inválidos", async () => {
    render(<Form />);

    const emailInput = screen.getByTitle("E-mail");
    const linkedinInput = screen.getByTitle("LinkedIn");
    const githubInput = screen.getByTitle("Github");
    const emailSetCustomValidity = vi.spyOn(emailInput, "setCustomValidity");
    const linkedinSetCustomValidity = vi.spyOn(
      linkedinInput,
      "setCustomValidity"
    );
    const githubSetCustomValidity = vi.spyOn(githubInput, "setCustomValidity");

    fireEvent.input(emailInput, {
      target: { value: "invalid-email" },
    });
    fireEvent.input(linkedinInput, {
      target: { value: "http://invalid-linkedin-url" },
    });
    fireEvent.input(githubInput, {
      target: { value: "http://invalid-github-url" },
    });

    fireEvent.submit(screen.getByTestId("form"));

    await waitFor(() => {
      vi.runOnlyPendingTimersAsync();

      expect(emailSetCustomValidity).toHaveBeenCalledWith(
        "Formato de e-mail inválido"
      );
      expect(linkedinSetCustomValidity).toHaveBeenCalledWith(
        'A URL deve começar com "https://www.linkedin.com/in/"'
      );
      expect(githubSetCustomValidity).toHaveBeenCalledWith(
        'A URL deve começar com "https://github.com/"'
      );
    });
  });

  test("Deve salvar os dados do formulário no sessionStorage após o envio bem-sucedido", async () => {
    render(<Form />);

    fireEvent.change(screen.getByTitle("Nome completo"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTitle("E-mail"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTitle("Telefone"), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));
    fireEvent.click(screen.getByTestId("select-option-1"));
    fireEvent.change(screen.getByTitle("LinkedIn"), {
      target: { value: "https://www.linkedin.com/in/john-doe" },
    });
    fireEvent.change(screen.getByTitle("Github"), {
      target: { value: "https://github.com/johndoe" },
    });

    fireEvent.submit(screen.getByTestId("form"));

    await waitFor(() => {
      vi.runOnlyPendingTimersAsync();

      const storedData = JSON.parse(sessionStorage.getItem("memberData"));
      expect(storedData).toEqual({
        fullName: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        jobPosition: "1",
        linkedin: "https://www.linkedin.com/in/john-doe",
        github: "https://github.com/johndoe",
      });
    });
  });

  test("Deve abrir o diálogo após o envio bem-sucedido", async () => {
    render(<Form />);

    fireEvent.change(screen.getByTitle("Nome completo"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTitle("E-mail"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTitle("Telefone"), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));
    fireEvent.click(screen.getByTestId("select-option-1"));
    fireEvent.change(screen.getByTitle("LinkedIn"), {
      target: { value: "https://www.linkedin.com/in/john-doe" },
    });
    fireEvent.change(screen.getByTitle("Github"), {
      target: { value: "https://github.com/johndoe" },
    });

    fireEvent.submit(screen.getByTestId("form"));

    await waitFor(() => {
      vi.runOnlyPendingTimersAsync();

      assert.exists(screen.getByText("Cadastro efetuado"));
    });
  });

  test("Deve fechar Dialog e abrir MemberCard quando o botão 'Fechar' é clicado", async () => {
    render(<Form />);

    fireEvent.change(screen.getByTitle("Nome completo"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTitle("E-mail"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTitle("Telefone"), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));
    fireEvent.click(screen.getByTestId("select-option-1"));
    fireEvent.change(screen.getByTitle("LinkedIn"), {
      target: { value: "https://www.linkedin.com/in/john-doe" },
    });
    fireEvent.change(screen.getByTitle("Github"), {
      target: { value: "https://github.com/johndoe" },
    });

    fireEvent.submit(screen.getByTestId("form"));

    await waitFor(() => {
      vi.runOnlyPendingTimersAsync();

      assert.exists(screen.getByText("Cadastro efetuado"));
      fireEvent.click(screen.getByTestId("dialog-close-button"));

      assert.exists(screen.getByTestId("new-member-button"));

      fireEvent.click(screen.getByTestId("new-member-button"));
    });
  });
});
