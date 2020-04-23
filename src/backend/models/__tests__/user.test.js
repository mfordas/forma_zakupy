import { validateUser } from "../user.js";

describe("User validation", () => {
  it("should return valid user if all conditions are correct", () => {
    const newUser = {
      name: "Mat",
      email: "mail@mail.com",
      password: "12345678"
    };

    const validatedUser = validateUser(newUser);

    expect(validatedUser.value).toEqual({
      name: "Mat",
      email: "mail@mail.com",
      password: "12345678"
    });
  });

  it("should return required errors if data is empty", () => {
    const newUser = {
      name: "",
      email: "",
      password: "12345678"
    }
    
    const validatedUser = validateUser(newUser);

    expect(validatedUser.error.message).toContain("Please type your name");
    expect(validatedUser.error.message).toContain("Please type your e-mail");
  });

  it("should return length errors if data is too short", () => {
    const newUser = {
      name: "A",
      email: "A",
      password: "12345678"
       }
       
       const validatedUser = validateUser(newUser);

    expect(validatedUser.error.message).toContain(
      "Name should have at least 3 characters"
    );
    expect(validatedUser.error.message).toContain(
      "E-mail should have at least 5 characters"
    );
  });

  it("should return length errors if data is too long", () => {
    const newUser = {
      name: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      email:
        "email@mail.comAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      password: "12345678"}
      
      const validatedUser = validateUser(newUser);

    expect(validatedUser.error.message).toContain(
      "Name should have maximum 26 characters"
    );
    expect(validatedUser.error.message).toContain(
      "E-mail should have maximum 255 characters"
    );
  });

  it("should return email format error if email adress is wrong", () => {
    const newUser = {
      name: "AAA",
      lastName: "AAA",
      email: "AAAAA",
      password: "12345678" }
      
      const validatedUser = validateUser(newUser);

    expect(validatedUser.error.message).toContain(
      "E-mail should have following format: id@domain"
    );
  });
});
