import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, assert, describe, expect, test, vi } from "vitest";
import Input from "../Input";
import { useMask } from "@react-input/mask";

vi.mock("@react-input/mask", () => ({
  useMask: vi.fn(),
}));

describe("Input Component", () => {
  const mockOnChange = vi.fn();
  const inputTestId = "input";
  const labelTestId = "input-label";

  afterEach(() => {
    cleanup();
  });

  test("renderiza corretamente", () => {
    render(
      <Input
        value=""
        onChange={mockOnChange}
        label="Nome"
        name="fullName"
        type="text"
      />
    );

    const label = screen.getByTestId(labelTestId);
    const input = screen.getByTestId(inputTestId);

    assert.exists(label);
    assert.exists(input);
    expect(label.innerHTML).toBe("Nome");
    expect(input.id).toBe("fullName");
  });

  test("renderiza asterisco na label quando a prop required é verdadeira", () => {
    render(
      <Input
        required
        onChange={mockOnChange}
        value=""
        label="Nome"
        name="fullName"
        type="text"
      />
    );

    const label = screen.getByTestId(labelTestId);

    assert.exists(label);
    expect(label.innerHTML).toBe(`Nome<span class="text-primary-default ml-3">*</span>`);
  });

  test("invoca onChange quando o valor do input muda", () => {
    render(
      <Input
        value=""
        onChange={mockOnChange}
        label="Nome"
        name="fullName"
        type="text"
      />
    );

    const input = screen.getByTestId(inputTestId);
    fireEvent.change(input, { target: { value: "Teste" } });

    expect(input.value).toBe("Teste");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: input })
    );
  });

  test("Renderiza com um tipo específico", () => {
    render(
      <Input
        value=""
        onChange={mockOnChange}
        label="Email"
        id="email"
        type="email"
      />
    );

    const input = screen.getByTestId(inputTestId);
    expect(input.type).toBe("email");
  });

  test("Aplica máscara quando tipo é tel", () => {
    render(
      <Input
        value=""
        onChange={mockOnChange}
        label="Email"
        id="email"
        type="tel"
      />
    );

    const input = screen.getByTestId(inputTestId);

    expect(input.type).toBe("tel");
    expect(useMask).toHaveBeenCalledWith({
      mask: "(__) _____-____",
      replacement: { _: /\d/ },
    });
  });
});
