
import { Loader2 } from "lucide-react";

function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-60 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2
          size={32}
          className="animate-spin text-blue-600"
        />

        <p className="text-sm text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

export default Loader;

