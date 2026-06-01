import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import * as ProductModelModule from "../../models/ProductModel.js";

const resolveModuleDefault = (moduleValue) => moduleValue?.default ?? moduleValue;
const ProductModel = resolveModuleDefault(ProductModelModule);

export const addProductToWishlistValidator = [
	check("productId")
		.isMongoId()
		.withMessage("Invalid Product id format")
		.custom((productId) =>
			ProductModel.findById(productId).then((product) => {
				if (!product) {
					return Promise.reject(
						new Error(`No product for this id: ${productId}`),
					);
				}
			}),
		),
	validatorMiddleware,
];

export const removeProductFromWishlistValidator = [
	check("productId").isMongoId().withMessage("Invalid Product id format"),
	validatorMiddleware,
];
