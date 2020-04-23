import { validateProduct } from "../product.js";

describe("Product validation", () => {
  it("should return valid product if all conditions are correct", () => {
    const newProduct = {
      name: "Pomidor",
      amount: 2,
      unit: "kg"
     
    };

    const validatedProduct = validateProduct(newProduct);

    expect(validatedProduct.value).toEqual({
      name: "Pomidor",
      amount: 2,
      unit: "kg"
    });
  });

  it("should return required errors if data is empty", () => {
    const newProduct = {
      name: "",
     
    };

    const validatedProduct = validateProduct(newProduct);

    expect(validatedProduct.error.message).toContain("Please type your name");
  });

  it("should return length errors if data is too short", () => {
    const newProduct = {
      name: "A",
    };

    const validatedProduct = validateProduct(newProduct);

    expect(validatedProduct.error.message).toContain(
      "Name should have at least 3 characters"
    );
  });

  it("should return length errors if data is too long", () => {
    const newProduct = {
      name: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    };

    const validatedProduct = validateProduct(newProduct);

    expect(validatedProduct.error.message).toContain(
      "Name should have maximum 26 characters"
    );
  });

});
