import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/layout/logo";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-foreground" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-foreground" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-foreground" href="/subscription">
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-background to-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Track, Predict, and Reduce Your Environmental Impact with EcoPulse
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    EcoPulse empowers businesses to make sustainable choices with powerful data analytics, AI-driven predictions, and engaging tools.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                alt="EcoPulse Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
                height="550"
                src="https://picsum.photos/550/550?random=1"
                data-ai-hint="nature technology"
                width="550"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Everything You Need for Sustainability</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From insightful dashboards to AI predictions and competitive leaderboards, EcoPulse provides a comprehensive suite of tools.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none pt-12">
              <div className="grid gap-1 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <h3 className="text-lg font-bold text-primary">Data Dashboard</h3>
                <p className="text-sm text-muted-foreground">Visualize your carbon footprint, CO2 emissions, water waste, and electricity usage with clear charts and metrics.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <h3 className="text-lg font-bold text-primary">AI Carbon Prediction</h3>
                <p className="text-sm text-muted-foreground">Gain insights into future carbon footprints and explore potential impact scenarios based on your decisions.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <h3 className="text-lg font-bold text-primary">Gamified Leaderboard</h3>
                <p className="text-sm text-muted-foreground">Earn points for reducing environmental impact and compete with other companies in a friendly, gamified system.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <h3 className="text-lg font-bold text-primary">Customizable Reporting</h3>
                <p className="text-sm text-muted-foreground">Generate and export detailed reports on key environmental metrics, filterable by date and category.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <h3 className="text-lg font-bold text-primary">Subscription Kits</h3>
                <p className="text-sm text-muted-foreground">Subscribe to receive testing kits for accurate carbon emission calculations and other environmental data.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} EcoPulse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
