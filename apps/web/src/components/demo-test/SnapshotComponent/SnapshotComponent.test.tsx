import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SnapshotComponent from "./SnapshotComponent";

describe("SnapshotComponent", () => {
  it("should render correctly with given text", () => {
    const testText = "SnapshotComponent";
    const { container } = render(<SnapshotComponent text={testText} />);

    // テキストの存在を確認
    const paragraph = screen.getByText(testText);
    expect(paragraph).toBeInTheDocument();

    // スナップショットの照合
    expect(container).toMatchSnapshot();
  });

  it("should handle empty text prop", () => {
    const { container } = render(<SnapshotComponent text="" />);
    const paragraph = container.querySelector("p");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent("");
    expect(container).toMatchSnapshot();
  });

  it("should handle long text content", () => {
    const longText = "This is a very long text to test how the component handles larger content";
    const { container } = render(<SnapshotComponent text={longText} />);
    const paragraph = screen.getByText(longText);
    expect(paragraph).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});