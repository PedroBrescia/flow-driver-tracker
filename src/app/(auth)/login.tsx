import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import { useAppState } from '@/hooks/useAppState';

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAppState();

  const formatCpf = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    let formattedValue = '';
    if (cleanedValue.length > 0) formattedValue += cleanedValue.substring(0, 3);
    if (cleanedValue.length > 3) formattedValue += '.' + cleanedValue.substring(3, 6);
    if (cleanedValue.length > 6) formattedValue += '.' + cleanedValue.substring(6, 9);
    if (cleanedValue.length > 9) formattedValue += '-' + cleanedValue.substring(9, 11);
    return formattedValue;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(cpf, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md lg:max-w-lg p-8 lg:p-12 shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <AppLogo />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium text-foreground">
              CPF do Motorista
            </Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              maxLength={14}
              className="h-12 lg:h-14 text-base lg:text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 lg:h-14 text-base lg:text-lg pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 lg:h-14 px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 lg:h-14 text-base lg:text-lg font-semibold" size="lg">
            <LogIn className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            Entrar no Sistema
          </Button>
        </form>

        <div className="mt-6 p-4 lg:p-6 bg-muted/50 rounded-lg">
          <p className="text-xs lg:text-sm text-muted-foreground text-center mb-2">
            <strong>Dados para teste:</strong>
          </p>
          <p className="text-xs lg:text-sm text-muted-foreground text-center">
            CPF: 123.456.789-00 | Senha: senha123
          </p>
        </div>
      </Card>
    </div>
  );
}