import { validateExternalUser } from "../user_external_service.js";

describe("External User validation", () => {
  it("should return valid user if all conditions are correct", () => {
    const newExternalUser = {
      name: "Mat",
      email: "mail@mail.com",
      external_id: "12345678"
    };

    const validatedUser = validateExternalUser(newExternalUser);

    expect(validatedUser.value).toEqual({
      name: "Mat",
      email: "mail@mail.com",
      external_id: "12345678"
    });
  });

  it("should return required errors if data is empty", () => {
    const newExternalUser = {
      name: "",
      email: "",
      external_id: ""
    }
    
    const validatedUser = validateExternalUser(newExternalUser);

    expect(validatedUser.error.message).toContain("Please type your name");
    expect(validatedUser.error.message).toContain("Please type your e-mail");
    expect(validatedUser.error.message).toContain("Please type your external id");
  });

  it("should return length errors if data is too short", () => {
    const newExternalUser = {
      name: "A",
      email: "A",
      external_id: "1"
       }
       
       const validatedUser = validateExternalUser(newExternalUser);

    expect(validatedUser.error.message).toContain(
      "Name should have at least 3 characters"
    );
    expect(validatedUser.error.message).toContain(
      "E-mail should have at least 5 characters"
    );
    expect(validatedUser.error.message).toContain(
      "External id should have at least 3 characters"
    );
  });

  it("should return length errors if data is too long", () => {
    const newExternalUser = {
      name: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      email:
        "email@mail.comAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      external_id: "12345678131984095065490856316546501254163025"}
      
      const validatedUser = validateExternalUser(newExternalUser);

    expect(validatedUser.error.message).toContain(
      "Name should have maximum 26 characters"
    );
    expect(validatedUser.error.message).toContain(
      "E-mail should have maximum 255 characters"
    );
    expect(validatedUser.error.message).toContain(
      "External id should have maximum 26 characters"
    );
  });

  it("should return email format error if email adress is wrong", () => {
    const newExternalUser = {
      name: "AAA",
      email: "AAAAA",
      password: "12345678" }
      
      const validatedUser = validateExternalUser(newExternalUser);

    expect(validatedUser.error.message).toContain(
      "E-mail should have following format: id@domain"
    );
  });
});
