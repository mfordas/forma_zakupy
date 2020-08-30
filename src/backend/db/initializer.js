import bcrypt from "bcryptjs";
import defaultProducts from "./defaultProducts/defaultProducts.js";

const transactional = initializer => async (model, models, idCatalog) => {
  let result;
  const session = await model.startSession();
  await session.withTransaction(async () => {
    result = await initializer(models, idCatalog);
  });
  return result;
};

const hashPassword = async password =>
  await bcrypt.hash(password, await bcrypt.genSalt(10));

const createModelBatch = async (model, data) => {
  const createdDocuments = [];
  for (let modelData of data) {
    const createdDocument = new model(modelData);
    createdDocuments.push(createdDocument);
    await createdDocument.save();
  }
  const idArray = [];
  createdDocuments.forEach(element => {
    idArray.push(element._id);
  });
  return idArray;
};

const arrayWithCount = count => fn => [...Array(count).keys()].map(fn);

const createAdminAccount = async models => {
  const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD);
  const adminEmail = process.env.ADMIN_EMAIL;
  const userData = {
    name: "Admin",
    email: adminEmail,
    password: adminPassword,
    shopping_lists_id: [],
    common_shopping_lists_id: [],
    custom_products: [],
    notifications:[],
    isAdmin: true,
    isVerified: true
  };
  const User = models.user;
  const createdUser = new User(userData);

  return await createdUser.save();
};

const createProduct = async (prefix, count, models) => {
  const productsData = arrayWithCount(count)(x => {
    if (defaultProducts[x] !== undefined) {
      return defaultProducts[x];
    } else {
      return {
        name: prefix + x,
        amount: 0,
        unit: "",
        bought: false
      };
    }
  });
  return await createModelBatch(models.product, productsData);
};

const userInitializer = async models => {
  return await createAdminAccount(models);
};

const productInitializer = async (models, idCatalog) => {
  const prefix = "Product_";
  return await createProduct(
    prefix,
    defaultProducts.length,
    models,
    idCatalog["product"]
  );
};

const defaultInitializers = new Map([
  ["product", productInitializer],
  ["user", userInitializer]
]);

const initOrder = ["product", "user"];

const initialize = async (models, initializers = defaultInitializers) => {
  let idCatalog = [];
  for (let modelName of initOrder) {
    if (!initializers.has(modelName)) {
      console.log(`[MongoDB] Could not find initializer for ${modelName}`);
      continue;
    }
    console.log(`[MongoDB] Initializing data for ${modelName}`);
    const initializer = initializers.get(modelName);
    idCatalog[modelName] = await transactional(initializer)(
      models[modelName],
      models,
      idCatalog
    );
  }
};

export default initialize;
