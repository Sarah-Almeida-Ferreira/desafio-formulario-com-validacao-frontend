import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import MemberCard from "../MemberCard";
import { JOB_POSITIONS } from "../../../consts/jobPositions.const";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

const mockMemberData = {
  fullName: "Teste da silva",
  email: "sarah@example.com",
  phone: "(11) 99999-9999",
  jobPosition: "1",
  linkedin: "https://www.linkedin.com/in/teste",
  github: "https://github.com/teste",
};

const setupSessionStorage = (mockData) => {
  sessionStorage.setItem("memberData", JSON.stringify(mockData));
};

const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();

describe("MemberCard component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("deve renderizar o dados do membro cadastrado da sessionStorage", () => {
    setupSessionStorage(mockMemberData);

    render(<MemberCard onClose={vi.fn()} />);

    assert.exists(screen.getByText(mockMemberData.fullName));
    assert.exists(screen.getByText(mockMemberData.email));
    assert.exists(screen.getByText(mockMemberData.phone));

    const jobPosition = JOB_POSITIONS.find(
      (opt) => opt.key === mockMemberData.jobPosition
    ).label;
    assert.exists(screen.getByText(jobPosition));
    assert.exists(
      screen.getByText(mockMemberData.linkedin.replace("https://", ""))
    );
    assert.exists(
      screen.getByText(mockMemberData.github.replace("https://", ""))
    );
    assert.exists(screen.getByTestId("new-member-button"));
  });

  test("não deve renderizar dados do membro quando sessionStorage está vazia", () => {
    setupSessionStorage(null);

    render(<MemberCard onClose={vi.fn()} />);

    expect(screen.queryByTestId("new-member-button")).toBeNull();
  });

  test("deve invocar onClose quando botão 'Cadastrar novo membro' é clicado", () => {
    const mockOnClose = vi.fn();
    setupSessionStorage(mockMemberData);

    render(<MemberCard onClose={mockOnClose} />);
    const button = screen.getByTestId("new-member-button");
    fireEvent.click(button);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
