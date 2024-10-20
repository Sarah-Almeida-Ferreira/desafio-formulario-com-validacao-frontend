import {
  render,
  fireEvent,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { afterEach, assert, describe, expect, test, vi } from "vitest";
import Select from "../Select";
import { JOB_POSITIONS } from "../../../consts/jobPositions.const";

describe("Select component", () => {
  const mockOnChange = vi.fn();
  vi.useFakeTimers();

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  test("deve renderizar o componente corretamente", () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );

    assert.exists(screen.getByTestId("select-container"));
    expect(screen.getByTestId("select-label").innerHTML).toBe(
      "Escolha uma opção"
    );
    assert.exists(screen.getByTestId("select-input"));
  });

  test("deve abrir e fechar o dropdown corretamente", () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );

    assert.notExists(screen.queryByTestId("select-dropdown"));
    assert.notExists(screen.queryByTestId("select-search-input"));

    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));

    assert.exists(screen.getByTestId("select-dropdown"));
    assert.exists(screen.queryByTestId("select-search-input"));

    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));

    assert.notExists(screen.queryByTestId("select-dropdown"));
    assert.notExists(screen.queryByTestId("select-search-input"));
  });

  test("deve abrir e fechar o dropdown corretamente - click", () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );

    assert.notExists(screen.queryByTestId("select-dropdown"));
    assert.notExists(screen.queryByTestId("select-search-input"));

    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));

    assert.exists(screen.getByTestId("select-dropdown"));
    assert.exists(screen.queryByTestId("select-search-input"));

    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));

    assert.notExists(screen.queryByTestId("select-dropdown"));
    assert.notExists(screen.queryByTestId("select-search-input"));
  });

  test("Deve fechar o dropdown quando outro elemento for clicado", async () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );

    await waitFor(() => {
      vi.runOnlyPendingTimersAsync();

      assert.notExists(screen.queryByTestId("select-dropdown"));
      assert.notExists(screen.queryByTestId("select-search-input"));

      fireEvent.click(screen.getByTestId("select-dropdown-toggle"));

      assert.exists(screen.getByTestId("select-dropdown"));
      assert.exists(screen.queryByTestId("select-search-input"));

      fireEvent.focusOut(screen.getByTestId("select-input"));

      assert.notExists(screen.queryByTestId("select-dropdown"));
      assert.notExists(screen.queryByTestId("select-search-input"));
    });
  });

  test("Não deve fechar o dropdown quando elemento filho do select for clicado", async () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );

    await waitFor(() => {
      vi.runOnlyPendingTimersAsync();

      assert.notExists(screen.queryByTestId("select-dropdown"));
      assert.notExists(screen.queryByTestId("select-search-input"));

      fireEvent.click(screen.getByTestId("select-dropdown-toggle"));

      assert.exists(screen.getByTestId("select-dropdown"));
      assert.exists(screen.queryByTestId("select-search-input"));

      fireEvent.focusOut(screen.getByTestId("select-input"), {
        relatedTarget: screen.getByTestId("select-search-input"),
      });

      assert.exists(screen.queryByTestId("select-dropdown"));
      assert.exists(screen.queryByTestId("select-search-input"));
    });
  });

  test("deve selecionar uma opção corretamente - click", () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );
    const selectedOption = JOB_POSITIONS[1];

    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));
    fireEvent.click(screen.getByTestId(`select-option-${selectedOption.key}`));

    expect(screen.getByTestId("select-input").value).toBe(selectedOption.label);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      target: {
        name: "jobPosition",
        value: "2",
      },
    });
  });

  test("deve selecionar uma opção corretamente - Enter", () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );
    const selectedOption = JOB_POSITIONS[1];
    const event = { key: "Enter" };

    fireEvent.keyDown(screen.getByTestId("select-dropdown-toggle"), event);
    fireEvent.keyDown(
      screen.getByTestId(`select-option-${selectedOption.key}`),
      event
    );

    expect(screen.getByTestId("select-input").value).toBe(selectedOption.label);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: "jobPosition", value: "2" },
    });
  });

  test("deve selecionar uma opção corretamente - Space", () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );
    const selectedOption = JOB_POSITIONS[1];
    const event = { key: " " };

    fireEvent.keyDown(screen.getByTestId("select-dropdown-toggle"), event);
    fireEvent.keyDown(
      screen.getByTestId(`select-option-${selectedOption.key}`),
      event
    );

    expect(screen.getByTestId("select-input").value).toBe(selectedOption.label);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      target: {
        name: "jobPosition",
        value: "2",
      },
    });
  });

  test("opção selecionada deve conter a className 'selected'", () => {
    render(
      <Select
        name="jobPosition"
        value="1"
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );

    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));

    expect(screen.getByTestId(`select-option-1`).classList).toContain(
      "selected"
    );
  });

  test("deve filtrar opções com base na pesquisa", () => {
    render(
      <Select
        name="jobPosition"
        value=""
        onChange={mockOnChange}
        label="Escolha uma opção"
        options={JOB_POSITIONS}
      />
    );
    const searchedOption = JOB_POSITIONS[1];
    const unsearchedOptions = JOB_POSITIONS.filter(
      (option) => option.key !== searchedOption.key
    );

    fireEvent.click(screen.getByTestId("select-dropdown-toggle"));
    fireEvent.change(screen.getByTestId("select-search-input"), {
      target: { value: searchedOption.label },
    });

    assert.exists(screen.getByTestId(`select-option-${searchedOption.key}`));
    unsearchedOptions.forEach((option) => {
      assert.notExists(screen.queryByTestId(`select-option-${option.key}`));
    });
  });
});
