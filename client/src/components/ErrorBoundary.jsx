import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * ErrorBoundary — catches unhandled JS errors in the React tree and renders
 * a user-friendly fallback instead of a blank screen.
 */
class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Log to an error reporting service in production
		console.error('[ErrorBoundary]', error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			// Allow a custom fallback via props
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
					<div className="max-w-md w-full text-center">
						{/* Icon */}
						<div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg
								className="w-10 h-10 text-red-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>

						<h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
							Something went wrong
						</h1>
						<p className="text-gray-500 mb-8 font-medium text-sm">
							An unexpected error occurred. Please try refreshing the page or go back to the homepage.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								onClick={() => {
									this.handleReset();
									window.location.reload();
								}}
								className="min-h-[44px] px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl
									hover:bg-gray-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2
									focus-visible:outline-gray-900"
							>
								Refresh Page
							</button>
							<Link
								to="/"
								onClick={this.handleReset}
								className="min-h-[44px] px-6 py-3 border-2 border-gray-200 text-gray-700 text-sm font-bold
									rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center
									focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
							>
								Go Home
							</Link>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
