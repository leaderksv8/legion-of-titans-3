import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton, CardSkeleton, TextSkeleton, HeroSkeleton } from "@/shared/ui/Skeleton";

describe("Skeleton Components", () => {
  it("renders basic Skeleton component", () => {
    const { container } = render(<Skeleton count={3} />);
    const skeletons = container.querySelectorAll("div");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders CardSkeleton component", () => {
    const { container } = render(<CardSkeleton count={2} />);
    expect(container).toBeTruthy();
  });

  it("renders TextSkeleton component", () => {
    const { container } = render(<TextSkeleton lines={3} />);
    expect(container).toBeTruthy();
  });

  it("renders HeroSkeleton component", () => {
    const { container } = render(<HeroSkeleton />);
    expect(container).toBeTruthy();
  });

  it("Skeleton renders with correct count", () => {
    const { container } = render(
      <Skeleton count={5} />
    );
    // Count divs with animate-pulse class (the skeleton items)
    const skeletonElements = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletonElements.length).toBe(5);
  });
});
