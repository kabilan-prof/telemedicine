import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const themes = [
    { value: 'light', label: t('lightMode'), icon: Sun },
    { value: 'dark', label: t('darkMode'), icon: Moon },
    { value: 'system', label: t('systemMode'), icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme);
  const Icon = currentTheme?.icon || Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentTheme?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value as any)}
              className={theme === themeOption.value ? 'bg-accent' : ''}
            >
              <ThemeIcon className="h-4 w-4 mr-2" />
              {themeOption.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;