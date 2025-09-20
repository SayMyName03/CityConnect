import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';


interface LoginPageProps {
  userType: 'citizen' | 'admin';
}

const LoginPage: React.FC<LoginPageProps> = ({ userType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password, userType);
      toast.success(`Welcome! Logged in as ${userType}`);
      navigate(userType === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CityConnect</span>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
          
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <div className="mt-4">
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-border"></div>
              <div className="text-sm text-muted-foreground">or</div>
              <div className="flex-1 h-px bg-border"></div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border bg-white"
              onClick={() => { window.location.href = '/api/auth/google?role=citizen'; }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" className="inline-block" aria-hidden>
                <path fill="#EA4335" d="M24 9.5c3.9 0 7 1.3 9.4 3.4l7-7C35 2 30.9 0 24 0 14.9 0 7.3 5.7 3.3 13.8l8.2 6.4C13.8 14 18.4 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v8h12.8c-.6 3-2.8 5.5-6.1 7.1l9.5 7.3C44.4 38.1 46.5 31.8 46.5 24.5z"/>
                <path fill="#4A90E2" d="M10.9 28.9c-.6-1.8-.9-3.7-.9-5.7s.3-3.9.9-5.7L2.7 11.1C1 14.6 0 18.6 0 22.9s1 8.3 2.7 11.8l8.2-5.8z"/>
                <path fill="#FBBC05" d="M24 48c6.6 0 12.3-2.2 16.4-6l-9.5-7.3c-2.6 1.7-6 2.7-9.9 2.7-5.6 0-10.2-4.5-11.8-10.5L2.7 36.9C7.3 43.3 14.9 48 24 48z"/>
              </svg>
              Sign in with Google
            </Button>
          </div>
          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <a 
              href="/register" 
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Create account
            </a>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-800"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;