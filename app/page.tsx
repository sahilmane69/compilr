import { Hero } from "../components/Hero";
import { CompilerIDE } from "../components/CompilerIDE";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthorBadge } from "../components/AuthorBadge";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LoadingScreen />
      <AuthorBadge />
      <div className="mobile-warning">
        <h2>Desktop Only</h2>
        <p>This compiler visualization tool is designed for large screens. Please open it on a desktop.</p>
      </div>
      <Hero />
      <CompilerIDE />
      <Footer />
    </main>
  );
}
