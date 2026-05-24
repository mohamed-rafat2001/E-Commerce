import { z } from 'zod';

// ────────────────────────────────────────────────────
// Shared / Reusable field schemas
// ────────────────────────────────────────────────────

const nameField = (label, min = 3) =>
	z
		.string()
		.trim()
		.min(min, `${label} must be at least ${min} characters`);

const emailField = z
	.string()
	.trim()
	.min(1, 'Email is required')
	.email('Please enter a valid email');

const phoneField = z
	.string()
	.trim()
	.min(1, 'Phone number is required')
	.regex(
		/^[+]?[\d\s\-()]{7,20}$/,
		'Please enter a valid phone number'
	);

const strongPasswordField = z
	.string()
	.min(1, 'Password is required')
	.min(8, 'Password must be at least 8 characters')
	.regex(/[a-z]/, 'Must contain at least one lowercase letter')
	.regex(/[A-Z]/, 'Must contain at least one uppercase letter')
	.regex(/\d/, 'Must contain at least one number')
	.regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character');

// ────────────────────────────────────────────────────
// AUTH: Login
// ────────────────────────────────────────────────────

export const loginSchema = z.object({
	email: emailField,
	password: z.string().min(1, 'Password is required'),
});

// ────────────────────────────────────────────────────
// AUTH: Register (multi-step, validated per step)
// ────────────────────────────────────────────────────

export const registerStepOneSchema = z
	.object({
		email: emailField,
		password: strongPasswordField,
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export const registerStepTwoSchema = z.object({
	firstName: nameField('First name', 3),
	lastName: nameField('Last name', 3),
	phoneNumber: phoneField,
	gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
});

export const registerFullSchema = z
	.object({
		role: z.enum(['Customer', 'Seller'], { required_error: 'Role is required' }),
		email: emailField,
		password: strongPasswordField,
		confirmPassword: z.string().min(1, 'Please confirm your password'),
		firstName: nameField('First name', 3),
		lastName: nameField('Last name', 3),
		phoneNumber: phoneField,
		gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
		preferredCategories: z.array(z.string()).optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

// ────────────────────────────────────────────────────
// USER: Profile Update
// ────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
	firstName: nameField('First name', 3),
	lastName: nameField('Last name', 3),
	email: emailField,
	phoneNumber: phoneField,
});

// ────────────────────────────────────────────────────
// USER: Change Password
// ────────────────────────────────────────────────────

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: strongPasswordField,
		confirmPassword: z.string().min(1, 'Please confirm your new password'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

// ────────────────────────────────────────────────────
// ADDRESS
// ────────────────────────────────────────────────────

export const addressSchema = z.object({
	label: z.string().trim().min(1, 'Label is required'),
	recipientName: z.string().trim().min(1, 'Recipient name is required'),
	phone: phoneField,
	line1: z.string().trim().min(1, 'Address line 1 is required'),
	line2: z.string().trim().optional().or(z.literal('')),
	city: z.string().trim().min(1, 'City is required'),
	state: z.string().trim().optional().or(z.literal('')),
	postalCode: z.string().trim().min(1, 'Postal code is required'),
	country: z.string().trim().min(1, 'Country is required'),
});

// ────────────────────────────────────────────────────
// PAYMENT METHOD
// ────────────────────────────────────────────────────

export const paymentMethodSchema = (isEditing = false) =>
	z.object({
		type: z.enum(['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'], {
			required_error: 'Card type is required',
		}),
		holder: z.string().trim().min(1, 'Card holder name is required'),
		cardNumber: isEditing
			? z.string().optional()
			: z
				.string()
				.min(1, 'Card number is required')
				.regex(/^[\d\s•]{13,19}$/, 'Invalid card number'),
		expiry: z
			.string()
			.min(1, 'Expiry date is required')
			.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
		isDefault: z.boolean().optional(),
	});

// ────────────────────────────────────────────────────
// BRAND
// ────────────────────────────────────────────────────

export const brandSchema = z.object({
	name: z.string().trim().min(1, 'Brand name is required'),
	description: z.string().trim().min(1, 'Description is required'),
	businessEmail: emailField,
	businessPhone: phoneField,
	website: z
		.string()
		.trim()
		.refine(
			(val) => !val || /^https?:\/\/.+\..+/.test(val),
			'Please enter a valid URL (e.g. https://example.com)'
		)
		.optional()
		.or(z.literal('')),
	primaryCategory: z.string().optional().or(z.literal('')),
	subCategories: z.array(z.string()).optional(),
});

// ────────────────────────────────────────────────────
// PRODUCT
// ────────────────────────────────────────────────────

export const productSchema = z.object({
	name: z.string().trim().min(3, 'Product name must be at least 3 characters'),
	description: z.string().trim().min(3, 'Description must be at least 3 characters'),
	price: z
		.union([z.string(), z.number()])
		.refine(
			(val) => {
				const num = Number(val);
				return !isNaN(num) && num > 0;
			},
			'Price must be a positive number'
		),
	brandId: z.string().min(1, 'Brand is required'),
	primaryCategory: z.string().min(1, 'Primary category is required'),
	subCategory: z.string().nullable().optional(),
	countInStock: z
		.union([z.string(), z.number()])
		.transform((val) => Number(val))
		.refine((val) => !isNaN(val) && val >= 0, 'Stock must be 0 or greater'),
	status: z.enum(['draft', 'active', 'inactive', 'archived']).optional(),
	visibility: z.enum(['public', 'private']).optional(),
	sizes: z.array(z.string()).optional(),
	colors: z.array(z.string()).optional(),
});

// ────────────────────────────────────────────────────
// DISCOUNT
// ────────────────────────────────────────────────────

export const discountSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, 'Discount name is required')
			.max(100, 'Discount name cannot exceed 100 characters'),
		description: z
			.string()
			.trim()
			.max(500, 'Description cannot exceed 500 characters')
			.optional()
			.or(z.literal('')),
		type: z.enum(['percentage', 'fixed_amount', 'free_shipping', 'shipping_discount'], {
			required_error: 'Discount type is required',
		}),
		value: z
			.union([z.string(), z.number()])
			.transform((val) => (val === '' ? 0 : Number(val)))
			.refine((val) => !isNaN(val) && val >= 0, 'Value cannot be negative'),
		maxDiscountAmount: z
			.union([z.string(), z.number()])
			.transform((val) => (val === '' ? null : Number(val)))
			.refine((val) => val === null || (!isNaN(val) && val >= 0), 'Max discount cannot be negative')
			.optional()
			.nullable(),
		minOrderValue: z
			.union([z.string(), z.number()])
			.transform((val) => (val === '' ? 0 : Number(val)))
			.refine((val) => !isNaN(val) && val >= 0, 'Minimum order value cannot be negative')
			.optional(),
		scope: z.enum(['all_products', 'category', 'seller_all', 'single_product'], {
			required_error: 'Discount scope is required',
		}),
		targetIds: z.string().optional().or(z.literal('')),
		priority: z
			.union([z.string(), z.number()])
			.transform((val) => (val === '' ? undefined : Number(val)))
			.refine((val) => val === undefined || (!isNaN(val) && val >= 0 && val <= 1000), 'Priority must be 0–1000')
			.optional(),
		startDate: z.string().min(1, 'Start date is required'),
		endDate: z.string().min(1, 'End date is required'),
		isActive: z.boolean().optional(),
		usageLimit: z
			.union([z.string(), z.number()])
			.transform((val) => (val === '' ? null : Number(val)))
			.refine((val) => val === null || (!isNaN(val) && val >= 0), 'Usage limit cannot be negative')
			.optional()
			.nullable(),
		isCoupon: z.boolean().optional(),
		code: z.string().trim().optional().or(z.literal('')),
	})
	.superRefine((data, ctx) => {
		// Percentage max 100
		if (data.type === 'percentage' && data.value > 100) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Percentage discount cannot exceed 100%',
				path: ['value'],
			});
		}
		// Value required for non-free-shipping
		if (data.type !== 'free_shipping' && (data.value === undefined || data.value <= 0)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Value is required for this discount type',
				path: ['value'],
			});
		}
		// End date after start date
		if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'End date must be after start date',
				path: ['endDate'],
			});
		}
	});

// ────────────────────────────────────────────────────
// CATEGORY
// ────────────────────────────────────────────────────

export const categorySchema = z.object({
	name: z.string().trim().min(1, 'Category name is required'),
	description: z.string().trim().optional().or(z.literal('')),
	isActive: z.boolean().optional(),
});

// ────────────────────────────────────────────────────
// SUBCATEGORY
// ────────────────────────────────────────────────────

export const subCategorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name cannot exceed 100 characters'),
	categoryId: z.string().min(1, 'Parent category is required'),
	description: z
		.string()
		.trim()
		.max(500, 'Description cannot exceed 500 characters')
		.optional()
		.or(z.literal('')),
});

// ────────────────────────────────────────────────────
// ADMIN: User Form
// ────────────────────────────────────────────────────

export const adminUserSchema = (isEdit = false) =>
	z
		.object({
			firstName: nameField('First name', 3),
			lastName: nameField('Last name', 3),
			email: emailField,
			phoneNumber: phoneField,
			role: z.enum(['Customer', 'Seller', 'Admin'], { required_error: 'Role is required' }),
			status: z.enum(['active', 'suspended'], { required_error: 'Status is required' }),
			password: isEdit
				? z.string().optional().or(z.literal(''))
				: strongPasswordField,
			confirmPassword: isEdit
				? z.string().optional().or(z.literal(''))
				: z.string().min(1, 'Please confirm the password'),
		})
		.refine(
			(data) => {
				if (isEdit && !data.password) return true;
				return data.password === data.confirmPassword;
			},
			{ message: 'Passwords do not match', path: ['confirmPassword'] }
		);
