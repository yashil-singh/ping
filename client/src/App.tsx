import { Send } from "lucide-react";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Button>
        <Send />
      </Button>
    </div>
  );
}

export default App;
