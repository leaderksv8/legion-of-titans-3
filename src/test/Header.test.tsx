import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Container from "@/shared/ui/Container";

describe("Container Component", () => {
  it("renders container element", () => {
    const { container } = render(
      <Container>
        <div>Test Content</div>
      </Container>
    );
    expect(container).toBeTruthy();
  });

  it("renders children correctly", () => {
    const { container } = render(
      <Container>
        <div data-testid="child">Test Child</div>
      </Container>
    );
    
    const child = container.querySelector('[data-testid="child"]');
    expect(child).toBeTruthy();
  });
});

