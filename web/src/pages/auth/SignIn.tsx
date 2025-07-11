import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { signInSchema, SignInSchema } from '@/lib/validators/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authApis } from '@/apis/auth';
import { useToastNotifications } from '@/hooks/useToastNotification';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const SignIn = () => {
  const isMobile = useIsMobile();
  const toast = useToastNotifications();
  const navigate = useNavigate();

  const [saveAccount, setSaveAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // form handle
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    shouldFocusError: false,
  });

  const signInMutation = useMutation({
    mutationFn: authApis.signIn,
    onSuccess: (data) => {
      console.log('signIn', data);
      toast.showSuccess('Sign In Success');
      navigate('/');
    },
    onError: (errors: any) => {
      console.error('signIn', errors);
      toast.showError(errors?.message || 'Failed to sign In');
    },
  });
  const onSubmit = (data: SignInSchema) => {
    console.log('Form submitted with data:', data);
    signInMutation.mutate(data);
  };

  return (
    <>
      <Header />
      {/*Mobile Environment*/}
      {isMobile ? (
        <p>You're on a mobile device 📱</p>
      ) : (
        // Desktop Environment
        <>
          <div className="grid grid-cols-2 min-h-screen">
            <div className="col-span-1 flex justify-center flex-col min-h-screen">
              <div className="grid grid-cols-12">
                <div className="col-span-3"></div>
                <div className="col-span-6">
                  {/*Left Content*/}
                  <h3 className="font-raleway">Cloud Airline</h3>
                  <div className="w-full max-w-md mx-auto space-y-6">
                    {/* Header */}
                    <div className="space-y-6 pt-10">
                      <h1 className="text-4xl font-bold text-gray-900">
                        SIGN IN
                      </h1>
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                          onClick={() => navigate('/auth/sign-up')}
                          className="text-gray-900 underline font-medium hover:no-underline"
                        >
                          Create now
                        </button>
                      </p>
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                      className="space-y-4"
                    >
                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Email"
                          {...register('email')}
                          className={`${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            placeholder="Password"
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            className={`pr-10 ${
                              errors.password ? 'border-red-500' : ''
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Save Account & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="save-account"
                            checked={saveAccount}
                            onCheckedChange={(checked) =>
                              setSaveAccount(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="save-account"
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            Save account
                          </Label>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-gray-900 underline hover:no-underline disabled:opacity-50"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      {/* Sign In Button */}
                      <Button
                        type="submit"
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3"
                        disabled={signInMutation.isPending}
                      >
                        {signInMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign in'
                        )}
                      </Button>
                    </form>
                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full py-3 bg-transparent"
                        // onClick={() => googleSignInMutation.mutate()}
                        // disabled={isLoading}
                      >
                        Continue with Google
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-3"></div>
                </div>
              </div>
            </div>
            <div className="col-span-1 bg-primary rounded-l-4xl p-4">hi</div>
          </div>
        </>
      )}
    </>
  );
};
export default SignIn;
