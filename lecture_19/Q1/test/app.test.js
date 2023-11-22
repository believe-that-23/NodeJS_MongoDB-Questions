
import axios from "axios";
import link from './index.js'


// console.log(process.env);
// link = "http://51.20.43.8:5000";

describe("verifying deployment link", () => {
  // it("testing link", () => {
  //   const expectedFormat =
  //     /^http:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+)$/;
  //   expect(process.env.link).toMatch(expectedFormat);
  // });

  it("should respond with status 200", async () => {
    const response = await axios.get(link);
    expect(response.status).toBe(200);
  });
});