import { Button } from "@/components/ui/button";
import { Home, Calendar, Plus, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Create Post', href: '/create-post', icon: Plus },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Manage Posts', href: '/posts', icon: Settings },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-20 flex-col md:flex-row gap-2 md:gap-0 pt-2 md:pt-0">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-md text-white ">SocialScheduler</span>
            </Link>
            <div className="flex items-center md:hidden ml-auto gap-2 mt-2">
              <Button variant="ghost" size="sm" className="flex flex-col items-center">
                <User className="h-5 w-5 mb-0.5" />
                <span className="text-xs">Login</span>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "transition-colors h-10",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Link to={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden pb-2 pt-1">
          <div className="flex items-center gap-2 flex-wrap whitespace-normal px-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "flex-1 min-w-0 text-xs h-12 justify-center items-center text-center",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Link to={item.href} className="flex flex-col items-center justify-center w-full h-full">
                    <Icon className="h-5 w-5 mt-2 mb-1" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;