import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import Dialog from "../Dialog";

describe("Dialog Component", () => {
  afterEach(() => {
    cleanup();
  });

  test("deve renderizar o componente Dialog com o título e conteúdo", () => {
    const mockOnClose = vi.fn();
    const title = "Test Dialog";
    const content = <p>Conteúdo do diálogo</p>;

    render(
      <Dialog onClose={mockOnClose} title={title}>
        {content}
      </Dialog>
    );

    expect(
      screen.getByTestId("dialog-header").getElementsByTagName("H2")[0]
        .innerHTML
    ).toBe(title);
    expect(screen.getByTestId("dialog-content").innerHTML).toBe(
      "<p>Conteúdo do diálogo</p>"
    );
  });

  test("deve fechar o diálogo quando o botão de fechar é clicado", () => {
    const mockOnClose = vi.fn();

    render(
      <Dialog onClose={mockOnClose} title="Test Dialog">
        <p>Conteúdo do diálogo</p>
      </Dialog>
    );

    const closeButton = screen.getByTestId("dialog-close-button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("deve chamar onClose quando o diálogo é cancelado", () => {
    const mockOnClose = vi.fn();

    render(
      <Dialog onClose={mockOnClose} title="Test Dialog">
        <p>Conteúdo do diálogo</p>
      </Dialog>
    );

    const dialog = screen.getByTestId("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("deve mostrar o diálogo quando o componente é montado", () => {
    const mockOnClose = vi.fn();

    render(
      <Dialog onClose={mockOnClose} title="Test Dialog">
        <p>Conteúdo do diálogo</p>
      </Dialog>
    );

    const dialog = screen.getByTestId("dialog");

    expect(dialog.open).toBe(true);
  });
});
