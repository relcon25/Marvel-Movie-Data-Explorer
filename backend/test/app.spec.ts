import InterviewList from "./interview";

describe("App", () => {
  it("test1", async () => {
    const list = new InterviewList();
    list.set(1, 100);
    list.setAll(50);
    console.log(list.get(1)); // ❌ Expected: 50, but returns 100
  });
});
