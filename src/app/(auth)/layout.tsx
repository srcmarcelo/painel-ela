interface AuthLayoutProps {
    children: React.ReactNode;
  }
  
  export default function AuthLayout({ children }: AuthLayoutProps) {
    return <div className="min-h-screen flex-1 flex">{children}</div>;
  }
  