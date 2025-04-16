import React, { useState, useEffect, FormEvent } from 'react';
import { EyeIcon, EyeSlashIcon , EnvelopeIcon , LockClosedIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { loginWithApi } from '../../services/authService';



interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const AdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Focus on email input when component mounts
  useEffect(() => {
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
  }, []);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear errors when user types
    if (errors[name as keyof LoginFormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) return;
    setIsLoading(true);
  
    try {
      const result = await loginWithApi(formData.email, formData.password);
  
      if (!result.success) {
        setErrors({ general: result.message || 'Đăng nhập thất bại.' });
        return;
      }
  
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || '/admin/';
  
      if (!formData.rememberMe) {
        const token = localStorage.getItem('adminToken');
        localStorage.removeItem('adminToken');
        sessionStorage.setItem('adminToken', token || '');
      }
  
      window.location.href = redirectUrl;
  
    } catch (error) {
      setErrors({ general: 'Đăng nhập thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };
  

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập đúng định dạng email';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsLoading(true);
    
//     try {
//       // Simulate API call with timeout
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Get redirect URL from query params if exists
//       const urlParams = new URLSearchParams(window.location.search);
//       const redirectUrl = urlParams.get('redirect') || '/admin/';
      
//       // Store token if "Remember me" is checked
//       if (formData.rememberMe) {
//         localStorage.setItem('adminToken', 'sample-token');
//       } else {
//         sessionStorage.setItem('adminToken', 'sample-token');
//       }
      
//       // Redirect to dashboard or specified URL
//       window.location.href = redirectUrl;
      
//     } catch (error) {
//       setErrors({
//         general: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

  // Handle "Forgot password" click
  const handleForgotPassword = () => {
    // In a real app, this would navigate to the forgot password page
    alert('Tính năng đang được phát triển');
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    // In a real app, this would initiate OAuth login
    alert('Tính năng đăng nhập với Google đang được phát triển');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would update the document class or use a context
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-sky-50 to-white'}`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/api/placeholder/120/48"
            alt="AdminShop Logo"
          />
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-xl transition-all duration-300`}>
          <div className="mb-6 text-center">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Đăng nhập tài khoản Admin
            </h2>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EyeSlashIcon  className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'} transition duration-150 ease-in-out`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Mật khẩu</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'} transition duration-150 ease-in-out`}
                placeholder="Mật khẩu"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EnvelopeIcon  className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className={`h-4 w-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-blue-500' : 'text-blue-600 border-gray-300'} rounded focus:ring-blue-500`}
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nhớ đăng nhập
                </label>
              </div>
              
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition duration-150 ease-in-out`}
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>
            
            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
            
            {/* General error message */}
            {errors.general && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
          </form>
          
          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>hoặc</span>
              </div>
            </div>
          </div>
          
          {/* Google Login */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out`}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970012 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
              </svg>
              Đăng nhập với Google
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 AdminShop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;