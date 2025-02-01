import Logo from "./Logo";

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Logo className="animate-pulse h-20" />
    </div>
  );
};

export default LoadingScreen;
