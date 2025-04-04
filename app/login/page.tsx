// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Loader2,
//   Leaf,
//   Recycle,
//   Shield,
//   AlertCircle,
//   CheckCircle,
//   UserCog,
//   User,
//   Lock,
//   Mail,
// } from "lucide-react";
// import Image from "next/image";

// interface UserData {
//   email: string;
//   name: string;
//   picture: string;
// }

// interface AdminLoginFormData {
//   username: string;
//   password: string;
// }

// interface AdminRegisterFormData {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [user, setUser] = useState<UserData | null>(null);

//   // Admin login states
//   const [isAdminMode, setIsAdminMode] = useState(false);
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [loginFormData, setLoginFormData] = useState<AdminLoginFormData>({
//     username: "",
//     password: "",
//   });
//   const [registerFormData, setRegisterFormData] =
//     useState<AdminRegisterFormData>({
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     });

//   useEffect(() => {
//     const error = searchParams.get("error");
//     const success = searchParams.get("success");
//     if (error) setError(error);
//     if (success) setSuccess("Login successful!");
//   }, [searchParams]);

//   const handleGoogleLogin = () => {
//     setLoading(true);
//     setError(null);

//     // Redirect to backend authentication endpoint
//     window.location.href = "http://localhost:8000/auth/google/login";
//   };

//   const handleAdminLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:8000/auth/authority/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username: loginFormData.username,
//             password: loginFormData.password,
//           }),
//           credentials: "include", // Important for storing cookies
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         throw new Error(errorData?.detail || "Login failed");
//       }

//       const data = await response.json();
//       setSuccess("Admin login successful!");

//       // Redirect to admin dashboard after successful login
//       setTimeout(() => {
//         router.push("/admin");
//       }, 1000);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdminRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // Validate password match
//     if (registerFormData.password !== registerFormData.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:8000/auth/authority/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username: registerFormData.username,
//             email: registerFormData.email,
//             role: "authority",
//             password: registerFormData.password,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         throw new Error(errorData?.detail || "Registration failed");
//       }

//       setSuccess("Admin registration successful! You can now log in.");
//       setIsRegistering(false);
//       // Clear registration form
//       setRegisterFormData({
//         username: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to register");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLoginFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleRegisterInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     setRegisterFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#e8f5e9] flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#e0e0e0]">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="flex justify-center mb-4">
//               <div className="relative">
//                 <Leaf className="w-12 h-12 text-[#2e7d32] animate-pulse" />
//                 <Recycle className="w-8 h-8 text-[#2e7d32] absolute -bottom-2 -right-2 animate-spin-slow" />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-[#2e7d32] mb-2">
//               Sustainable Waste Management
//             </h1>
//             <p className="text-gray-600">
//               Join us in creating a cleaner, greener future
//             </p>
//           </div>

//           {/* Toggle between user and admin mode */}
//           <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
//             <button
//               className={`flex-1 py-2 rounded-md ${
//                 !isAdminMode
//                   ? "bg-white shadow-sm text-[#2e7d32]"
//                   : "text-gray-600"
//               } transition-all duration-200`}
//               onClick={() => setIsAdminMode(false)}
//             >
//               <User className="w-4 h-4 inline-block mr-1" />
//               User
//             </button>
//             <button
//               className={`flex-1 py-2 rounded-md ${
//                 isAdminMode
//                   ? "bg-white shadow-sm text-[#2e7d32]"
//                   : "text-gray-600"
//               } transition-all duration-200`}
//               onClick={() => setIsAdminMode(true)}
//             >
//               <UserCog className="w-4 h-4 inline-block mr-1" />
//               Admin
//             </button>
//           </div>

//           {/* Messages */}
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center"
//             >
//               <AlertCircle className="w-5 h-5 mr-2" />
//               {error}
//             </motion.div>
//           )}

//           {success && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center"
//             >
//               <CheckCircle className="w-5 h-5 mr-2" />
//               {success}
//             </motion.div>
//           )}

//           {/* User Info */}
//           {user && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-8 p-4 bg-[#f8f8f8] rounded-lg"
//             >
//               <div className="flex items-center space-x-4">
//                 <Image
//                   src={user.picture}
//                   alt={user.name}
//                   width={40}
//                   height={40}
//                   className="rounded-full"
//                 />
//                 <div>
//                   <p className="font-medium text-[#4a4a4a]">{user.name}</p>
//                   <p className="text-sm text-gray-500">{user.email}</p>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {isAdminMode ? (
//             <div>
//               {isRegistering ? (
//                 /* Admin Registration Form */
//                 <form onSubmit={handleAdminRegister} className="space-y-4">
//                   <h2 className="text-xl font-semibold text-center text-[#2e7d32] mb-4">
//                     Admin Registration
//                   </h2>

//                   <div className="space-y-2">
//                     <div className="relative">
//                       <User
//                         className="absolute left-3 top-3 text-gray-400"
//                         size={16}
//                       />
//                       <input
//                         type="text"
//                         name="username"
//                         value={registerFormData.username}
//                         onChange={handleRegisterInputChange}
//                         placeholder="Username"
//                         required
//                         className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent"
//                       />
//                     </div>

//                     <div className="relative">
//                       <Mail
//                         className="absolute left-3 top-3 text-gray-400"
//                         size={16}
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         value={registerFormData.email}
//                         onChange={handleRegisterInputChange}
//                         placeholder="Email"
//                         required
//                         className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent"
//                       />
//                     </div>

//                     <div className="relative">
//                       <Lock
//                         className="absolute left-3 top-3 text-gray-400"
//                         size={16}
//                       />
//                       <input
//                         type="password"
//                         name="password"
//                         value={registerFormData.password}
//                         onChange={handleRegisterInputChange}
//                         placeholder="Password"
//                         required
//                         className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent"
//                       />
//                     </div>

//                     <div className="relative">
//                       <Lock
//                         className="absolute left-3 top-3 text-gray-400"
//                         size={16}
//                       />
//                       <input
//                         type="password"
//                         name="confirmPassword"
//                         value={registerFormData.confirmPassword}
//                         onChange={handleRegisterInputChange}
//                         placeholder="Confirm Password"
//                         required
//                         className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full p-3 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
//                   >
//                     {loading ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       "Register as Admin"
//                     )}
//                   </button>

//                   <div className="text-center mt-4">
//                     <button
//                       type="button"
//                       onClick={() => setIsRegistering(false)}
//                       className="text-sm text-[#2e7d32] hover:underline"
//                     >
//                       Already have an account? Login
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 /* Admin Login Form */
//                 <form onSubmit={handleAdminLogin} className="space-y-4">
//                   <h2 className="text-xl font-semibold text-center text-[#2e7d32] mb-4">
//                     Admin Login
//                   </h2>

//                   <div className="space-y-3">
//                     <div className="relative">
//                       <User
//                         className="absolute left-3 top-3 text-gray-400"
//                         size={16}
//                       />
//                       <input
//                         type="text"
//                         name="username"
//                         value={loginFormData.username}
//                         onChange={handleLoginInputChange}
//                         placeholder="Username"
//                         required
//                         className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent"
//                       />
//                     </div>

//                     <div className="relative">
//                       <Lock
//                         className="absolute left-3 top-3 text-gray-400"
//                         size={16}
//                       />
//                       <input
//                         type="password"
//                         name="password"
//                         value={loginFormData.password}
//                         onChange={handleLoginInputChange}
//                         placeholder="Password"
//                         required
//                         className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full p-3 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
//                   >
//                     {loading ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       "Login as Admin"
//                     )}
//                   </button>

//                   <div className="text-center mt-4">
//                     <button
//                       type="button"
//                       onClick={() => setIsRegistering(true)}
//                       className="text-sm text-[#2e7d32] hover:underline"
//                     >
//                       Need an admin account? Register
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           ) : (
//             /* Regular User Section */
//             <>
//               {/* Features */}
//               <div className="grid grid-cols-2 gap-4 mb-8">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-[#f8f8f8] p-4 rounded-lg text-center"
//                 >
//                   <Recycle className="w-6 h-6 text-[#2e7d32] mx-auto mb-2" />
//                   <p className="text-sm text-[#4a4a4a]">Track Waste</p>
//                 </motion.div>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="bg-[#f8f8f8] p-4 rounded-lg text-center"
//                 >
//                   <Shield className="w-6 h-6 text-[#2e7d32] mx-auto mb-2" />
//                   <p className="text-sm text-[#4a4a4a]">Secure Access</p>
//                 </motion.div>
//               </div>

//               {/* Login Button */}
//               <button
//                 onClick={handleGoogleLogin}
//                 disabled={loading}
//                 className="w-full flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <Loader2 className="w-5 h-5 text-[#2e7d32] animate-spin" />
//                 ) : (
//                   <>
//                     <svg
//                       className="w-5 h-5 mr-2"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                     </svg>
//                     Continue with Google
//                   </>
//                 )}
//               </button>
//             </>
//           )}

//           {/* Footer */}
//           <div className="mt-8 text-center text-sm text-gray-500">
//             <p>By continuing, you agree to our</p>
//             <p className="mt-1">
//               <a href="#" className="text-[#2e7d32] hover:underline">
//                 Terms of Service
//               </a>{" "}
//               and{" "}
//               <a href="#" className="text-[#2e7d32] hover:underline">
//                 Privacy Policy
//               </a>
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Leaf,
  Recycle,
  Shield,
  AlertCircle,
  CheckCircle,
  UserCog,
  User,
  Lock,
  Mail,
} from "lucide-react";
import Image from "next/image";

interface UserData {
  email: string;
  name: string;
  picture: string;
}

interface AdminLoginFormData {
  username: string;
  password: string;
}

interface AdminRegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Admin login states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginFormData, setLoginFormData] = useState<AdminLoginFormData>({
    username: "",
    password: "",
  });
  const [registerFormData, setRegisterFormData] =
    useState<AdminRegisterFormData>({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    if (error) setError(error);
    if (success) setSuccess("Login successful!");
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);

    // Redirect to backend authentication endpoint
    window.location.href = "http://localhost:8000/auth/google/login";
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/authority/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loginFormData.username,
            password: loginFormData.password,
          }),
          credentials: "include", // Important for storing cookies
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Login failed");
      }

      const data = await response.json();
      setSuccess("Admin login successful!");

      // Redirect to admin dashboard after successful login
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password match
    if (registerFormData.password !== registerFormData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/authority/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: registerFormData.username,
            email: registerFormData.email,
            role: "authority",
            password: registerFormData.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Registration failed");
      }

      setSuccess("Admin registration successful! You can now log in.");
      setIsRegistering(false);
      // Clear registration form
      setRegisterFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setRegisterFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Determine content height for animation
  const getContentHeight = () => {
    if (isAdminMode) {
      return isRegistering ? 520 : 310;
    } else {
      return 180;
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF4EF] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradient circles - matching dashboard */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-green-300 rounded-full opacity-20 filter blur-3xl animate-pulse"></div>
      <div
        className="fixed bottom-10 right-10 w-80 h-80 bg-green-400 rounded-full opacity-10 filter blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="fixed top-1/3 left-1/2 w-96 h-96 bg-green-200 rounded-full opacity-10 filter blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl z-10"
      >
        <motion.div
          layout
          transition={{
            layout: { duration: 0.5, type: "spring", bounce: 0.2 },
          }}
          className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-10 relative overflow-hidden"
        >
          {/* Decorative element in card */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-green-100 rounded-full opacity-50"></div>

          {/* Header */}
          <motion.div layout className="text-center mb-8 relative z-10">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              layout
            >
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                  <Recycle className="w-12 h-12" />
                </div>
              </div>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold text-green-600 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              layout
            >
              Eco Smart
            </motion.h1>
            <motion.p
              className="text-lg text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              layout
            >
              Join us in creating a cleaner, greener future
            </motion.p>
          </motion.div>

          {/* Toggle between user and admin mode */}
          <motion.div
            layout
            className="flex mb-6 bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-white/30 relative z-10"
          >
            <div
              className="absolute inset-y-1 z-0 transition-all duration-500 ease-in-out"
              style={{
                left: isAdminMode ? "50%" : "0",
                right: isAdminMode ? "0" : "50%",
                background: "white",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            ></div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 rounded-md flex items-center justify-center gap-2 relative z-10 ${
                !isAdminMode ? "text-green-500 font-medium" : "text-slate-600"
              } transition-colors duration-300`}
              onClick={() => setIsAdminMode(false)}
              layout
            >
              <User className="w-5 h-5" />
              <span>User</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 rounded-md flex items-center justify-center gap-2 relative z-10 ${
                isAdminMode ? "text-green-500 font-medium" : "text-slate-600"
              } transition-colors duration-300`}
              onClick={() => setIsAdminMode(true)}
              layout
            >
              <UserCog className="w-5 h-5" />
              <span>Admin</span>
            </motion.button>
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 rounded-lg flex items-center relative z-10 border border-red-100/50"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-green-50/80 backdrop-blur-sm text-green-600 rounded-lg flex items-center relative z-10 border border-green-100/50"
              >
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feature boxes */}
          <motion.div
            layout
            className="grid grid-cols-2 gap-4 mb-6 relative z-10"
          >
            <motion.div
              layout
              whileHover={{
                scale: 1.03,
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
              className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/30 flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-2">
                <Recycle className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Track Waste
              </span>
            </motion.div>
            <motion.div
              layout
              whileHover={{
                scale: 1.03,
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
              className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/30 flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Secure Access
              </span>
            </motion.div>
          </motion.div>

          {/* Content container with animated transitions */}
          <motion.div
            layout
            className="relative z-10"
            animate={{
              height: getContentHeight(),
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            style={{ minHeight: getContentHeight() }}
          >
            <AnimatePresence mode="wait">
              {/* User Login Section */}
              {!isAdminMode && (
                <motion.div
                  key="user-login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-0 left-0 w-full"
                  layout
                >
                  <motion.button
                    layout
                    whileHover={{ scale: 1.02, backgroundColor: "#00b046" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-green-500 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 text-lg"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                            fill="white"
                          />
                          <path
                            d="M3.15302 7.3455L6.43851 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
                            fill="white"
                          />
                          <path
                            d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z"
                            fill="white"
                          />
                          <path
                            d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.784L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                            fill="white"
                          />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </motion.button>

                  <motion.div layout className="my-6 flex items-center">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="px-4 text-sm text-slate-500">
                      By continuing, you agree to our
                    </span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </motion.div>

                  <motion.div layout className="text-center text-sm">
                    <a href="#" className="text-green-600 hover:text-green-700">
                      Terms of Service
                    </a>
                    <span className="mx-2 text-slate-500">and</span>
                    <a href="#" className="text-green-600 hover:text-green-700">
                      Privacy Policy
                    </a>
                  </motion.div>
                </motion.div>
              )}

              {/* Admin Login Section */}
              {isAdminMode && !isRegistering && (
                <motion.form
                  key="admin-login"
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleAdminLogin}
                  className="space-y-5 absolute top-0 left-0 w-full"
                >
                  <motion.div layout>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={loginFormData.username}
                        onChange={handleLoginInputChange}
                        className="bg-white/50 backdrop-blur-sm py-3 px-4 pl-10 block w-full border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-base"
                        placeholder="Enter your username"
                      />
                    </div>
                  </motion.div>

                  <motion.div layout>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={loginFormData.password}
                        onChange={handleLoginInputChange}
                        className="bg-white/50 backdrop-blur-sm py-3 px-4 pl-10 block w-full border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-base"
                        placeholder="Enter your password"
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    layout
                    whileHover={{ scale: 1.02, backgroundColor: "#00b046" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-green-500 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 text-lg"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-6 h-6" />
                        Admin Login
                      </>
                    )}
                  </motion.button>

                  <motion.div layout className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(true)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Don't have an admin account? Register
                    </button>
                  </motion.div>
                </motion.form>
              )}

              {/* Admin Register Section */}
              {isAdminMode && isRegistering && (
                <motion.form
                  key="admin-register"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleAdminRegister}
                  className="space-y-5 absolute top-0 left-0 w-full"
                >
                  <motion.div layout>
                    <label
                      htmlFor="register-username"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="register-username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={registerFormData.username}
                        onChange={handleRegisterInputChange}
                        className="bg-white/50 backdrop-blur-sm py-3 px-4 pl-10 block w-full border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-base"
                        placeholder="Choose a username"
                      />
                    </div>
                  </motion.div>

                  <motion.div layout>
                    <label
                      htmlFor="register-email"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={registerFormData.email}
                        onChange={handleRegisterInputChange}
                        className="bg-white/50 backdrop-blur-sm py-3 px-4 pl-10 block w-full border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                  </motion.div>

                  <motion.div layout>
                    <label
                      htmlFor="register-password"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="register-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={registerFormData.password}
                        onChange={handleRegisterInputChange}
                        className="bg-white/50 backdrop-blur-sm py-3 px-4 pl-10 block w-full border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-base"
                        placeholder="Create a password"
                      />
                    </div>
                  </motion.div>

                  <motion.div layout>
                    <label
                      htmlFor="register-confirm-password"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={registerFormData.confirmPassword}
                        onChange={handleRegisterInputChange}
                        className="bg-white/50 backdrop-blur-sm py-3 px-4 pl-10 block w-full border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-base"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    layout
                    whileHover={{ scale: 1.02, backgroundColor: "#00b046" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-green-500 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 text-lg"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <UserCog className="w-6 h-6" />
                        Register as Admin
                      </>
                    )}
                  </motion.button>

                  <motion.div layout className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Already have an account? Login
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
