import { vi } from "vitest";

HTMLDialogElement.prototype.showModal = vi.fn(function () {
  this.open = true;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const reactPropsKey = Object.keys(this).find((key) =>
        key.match("reactProps")
      );
      const reactProps = this[reactPropsKey];
      reactProps?.onCancel(e);
    }
  });
});

HTMLDialogElement.prototype.close = vi.fn(function () {
  this.open = false;
});
