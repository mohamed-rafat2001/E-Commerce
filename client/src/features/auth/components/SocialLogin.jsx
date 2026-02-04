import { GoogleIcon, FacebookIcon } from "../../../shared/constants/icons.jsx";

const SocialLogin = () => {
	return (
		<>
			<div className="relative mt-4">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-200"></div>
				</div>
				<div className="relative flex justify-center text-xs uppercase tracking-wide">
					<span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 mt-4">
				<button
					type="button"
					className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
				>
					<GoogleIcon className="h-5 w-5 mr-2" />
					<span className="sr-only">Sign in with Google</span>
					Google
				</button>
				<button
					type="button"
					className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
				>
					<FacebookIcon className="h-5 w-5 mr-2 text-blue-600" />
					<span className="sr-only">Sign in with Facebook</span>
					Facebook
				</button>
			</div>
		</>
	);
};

export default SocialLogin;
