import { LoaderCircle } from "lucide-react";

export default function LazySpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-1">
      <div className="loader"></div>
      <h1 className="text-white font-semibold text-lg">LaundryWash</h1>
    </div>
  );
}
