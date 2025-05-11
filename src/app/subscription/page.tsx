import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Zap, Leaf } from "lucide-react";
import Image from "next/image";

const subscriptionPlans = [
  {
    name: "Starter Kit",
    price: "$49",
    frequency: "/month",
    description: "Essential tools for basic carbon footprint and energy monitoring.",
    features: [
      "Basic CO2 emission test strips (5 tests)",
      "Energy usage monitor (plug-in)",
      "Water flow rate bag",
      "Digital access to EcoTrack platform",
    ],
    icon: Package,
    imageSrc: "https://picsum.photos/300/200?random=20",
    imageAlt: "Starter testing kit",
    dataAiHint: "testing kit",
    cta: "Choose Starter",
    popular: false,
  },
  {
    name: "Pro Kit",
    price: "$99",
    frequency: "/month",
    description: "Comprehensive kit for detailed environmental impact analysis.",
    features: [
      "Advanced CO2 & Air Quality sensor (reusable)",
      "Smart energy monitoring suite (3 sensors)",
      "Precision water testing kit (pH, pollutants)",
      "Soil health test kit",
      "Priority support & advanced reporting",
    ],
    icon: Zap,
    imageSrc: "https://picsum.photos/300/200?random=21",
    imageAlt: "Pro testing kit",
    dataAiHint: "advanced kit",
    cta: "Choose Pro",
    popular: true,
  },
  {
    name: "Enterprise Solution",
    price: "Custom",
    frequency: "",
    description: "Tailored solutions for large organizations with specific needs.",
    features: [
      "Custom sensor deployments",
      "On-site calibration & support",
      "API access & integrations",
      "Dedicated account manager",
      "Volume discounts on kits",
    ],
    icon: Leaf,
    imageSrc: "https://picsum.photos/300/200?random=22",
    imageAlt: "Enterprise solution box",
    dataAiHint: "enterprise package",
    cta: "Contact Sales",
    popular: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Environmental Testing Kits
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Subscribe to receive our custom testing kits, designed to help you accurately measure your carbon emissions and other key environmental impact metrics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col shadow-lg ${plan.popular ? "border-2 border-primary ring-2 ring-primary/50" : ""}`}>
            {plan.popular && (
              <div className="py-1 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-t-lg text-center">
                Most Popular
              </div>
            )}
            <CardHeader className="items-center text-center">
              <plan.icon className={`h-12 w-12 mb-2 ${plan.popular ? 'text-primary' : 'text-accent'}`} />
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold tracking-tight text-foreground">{plan.price}</span>
                {plan.frequency && <span className="ml-1 text-xl font-semibold text-muted-foreground">{plan.frequency}</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Image 
                src={plan.imageSrc} 
                alt={plan.imageAlt} 
                width={300} 
                height={200} 
                className="rounded-md mb-6 object-cover aspect-[3/2]"
                data-ai-hint={plan.dataAiHint} 
              />
              <ul className="space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-accent hover:bg-accent/90 text-accent-foreground"}`}>
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-center mt-4">
        All subscriptions include digital access to the EcoTrack platform for data logging and analysis.
      </p>
    </div>
  );
}
