import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[70vh] flex-col items-center justify-center text-center pt-32 pb-24">
      <p className="font-display text-6xl text-moss/40">404</p>
      <p className="mt-4 text-ink/60">This page doesn't exist.</p>
      <Link to="/" className="mt-6 text-moss hover:text-gold">Back home</Link>
    </div>
  );
}
