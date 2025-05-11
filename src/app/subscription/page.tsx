
"use client";

import type React from 'react';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Zap, Leaf, AlertTriangle, Check, Lightbulb, Settings, RefreshCw, CalendarDays, XCircle, Sparkles, UserCheck, Microscope, Truck, Droplets } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const platformFee = 30; // Dinar

interface Sensor {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // Mock price per sensor for custom kit calculation
  icon: React.ElementType;
}

const allSensors: Sensor[] = [
  { id: "s1", name: "PMS5003 / SDS011", category: "Air Quality", description: "Measuring PM2.5 / PM10 (particulate matter).", price: 25, icon: Zap },
  { id: "s2", name: "MH-Z19", category: "Air Quality", description: "Measuring CO₂ levels.", price: 20, icon: Zap },
  { id: "s3", name: "BME680", category: "Air Quality", description: "Detecting VOC, humidity, temperature, gas.", price: 15, icon: Zap },
  { id: "s4", name: "DFRobot SEN0161 (pH)", category: "Water Quality", description: "Measuring pH in water.", price: 18, icon: Droplets },
  { id: "s5", name: "TDS Sensor (Gravity)", category: "Water Quality", description: "Measuring Total Dissolved Solids.", price: 12, icon: Droplets },
  { id: "s6", name: "Soil Moisture Sensor", category: "Soil Quality", description: "Detecting moisture levels in soil.", price: 10, icon: Leaf },
  { id: "s7", name: "Soil NPK Sensor", category: "Soil Quality", description: "Measuring Nitrogen, Phosphorus, Potassium.", price: 30, icon: Leaf },
  { id: "s8", name: "Sound Level Meter (SLM)", category: "Noise Pollution", description: "Measuring noise in decibels (dB).", price: 40, icon: Zap },
  { id: "s9", name: "Smart Energy Meter", category: "Energy & Emissions", description: "Tracking electricity consumption.", price: 50, icon: Zap },
  { id: "s10", name: "FLIR Thermal Camera", category: "Energy & Emissions", description: "Identifying heat leaks, energy inefficiency.", price: 150, icon: Zap },
  { id: "s11", name: "Smart Bin (Weight Sensor)", category: "Waste Monitoring", description: "Detecting fill level of waste bins.", price: 35, icon: Package },
  { id: "s12", name: "DHT22 / BME280", category: "Weather & Environmental", description: "Measuring temperature and humidity.", price: 8, icon: Zap },
  { id: "s13", name: "Multispectral Drone Camera", category: "Remote Sensing", description: "Assessing plant health, soil, contamination.", price: 300, icon: Package },
];

interface CompanyDetails {
  activities: string;
  products: string;
  materials: string;
  machinery: string;
}

export default function SubscriptionPage() {
  const { toast } = useToast();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    activities: "",
    products: "",
    materials: "",
    machinery: "",
  });
  const [kitCalculated, setKitCalculated] = useState(false);
  const [customKitSensors, setCustomKitSensors] = useState<Sensor[]>([]);
  const [customKitPrice, setCustomKitPrice] = useState(0);
  const [deliveryFrequency, setDeliveryFrequency] = useState<string>("monthly");
  const [expertHelp, setExpertHelp] = useState(false);
  const expertHelpPrice = 50; // Dinar
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculateKit = () => {
    if (!companyDetails.activities || !companyDetails.products || !companyDetails.materials || !companyDetails.machinery) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all company details to generate a custom kit.",
        variant: "destructive",
        action: <AlertTriangle className="text-red-500" />,
      });
      return;
    }
    // Mock sensor selection based on keywords (very basic)
    let selected: Sensor[] = [];
    if (companyDetails.activities.toLowerCase().includes("manufactur")) {
      selected.push(allSensors.find(s => s.id === "s9")!); // Smart Energy Meter
      selected.push(allSensors.find(s => s.id === "s1")!); // PM Sensor
    }
    if (companyDetails.products.toLowerCase().includes("chemical")) {
      selected.push(allSensors.find(s => s.id === "s4")!); // pH Sensor
      selected.push(allSensors.find(s => s.id === "s3")!); // VOC sensor
    }
     if (companyDetails.materials.toLowerCase().includes("metal")) {
      selected.push(allSensors.find(s => s.id === "s8")!); // Sound Level Meter
    }
    if (selected.length === 0) { // Add some default if no keywords match
        selected.push(allSensors.find(s => s.id === 's1')!);
        selected.push(allSensors.find(s => s.id === 's4')!);
        selected.push(allSensors.find(s => s.id === 's9')!);
    }
    
    selected = Array.from(new Set(selected.filter(Boolean))); // Remove duplicates and undefined

    setCustomKitSensors(selected);
    const kitPrice = selected.reduce((sum, sensor) => sum + sensor.price, 0);
    setCustomKitPrice(kitPrice);
    setKitCalculated(true);
    toast({
      title: "Custom Kit Generated!",
      description: `Based on your details, we've recommended a kit. Price: ${kitPrice} Dinar.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };
  
  useEffect(() => {
    if (orderConfirmed) {
        const today = new Date();
        const delivery = new Date(today.setDate(today.getDate() + 7)); // Mock delivery in 7 days
        setDeliveryDate(delivery.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}));
    }
  }, [orderConfirmed]);

  const totalMonthlyCost = platformFee + (deliveryFrequency === "monthly" && kitCalculated ? customKitPrice : 0) + (expertHelp ? expertHelpPrice : 0);
  const totalOneTimeCost = deliveryFrequency !== "monthly" && kitCalculated ? customKitPrice : 0;


  const handleConfirmPurchase = () => {
    if (!kitCalculated) {
         toast({
            title: "Kit Not Generated",
            description: "Please generate your custom kit first.",
            variant: "destructive",
          });
        return;
    }
    setOrderConfirmed(true);
    toast({
      title: "Purchase Confirmed!",
      description: "Your subscription and kit order have been processed.",
      action: <Truck className="text-green-500" />,
    });
  };
  
  const handleCancelSubscription = () => {
      setOrderConfirmed(false);
      setKitCalculated(false);
      setCustomKitSensors([]);
      setCustomKitPrice(0);
      // Reset company details if needed
      // setCompanyDetails({ activities: "", products: "", materials: "", machinery: "" });
       toast({
        title: "Subscription Canceled",
        description: "Your EcoPulse platform subscription has been canceled.",
        variant: "default"
      });
  }

  const handleCancelKitOrder = () => {
      setOrderConfirmed(false); // If kit order implies current delivery.
      // Potentially more specific logic if there are future scheduled kits
       toast({
        title: "Kit Order Canceled",
        description: "Your upcoming testing kit order has been canceled.",
        variant: "default"
      });
  }


  return (
    <div className="flex flex-col gap-8 items-center p-4 md:p-8">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          EcoPulse Subscription & Testing Kits
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Unlock powerful environmental analytics for a flat monthly fee of <strong className="text-foreground">{platformFee} Dinar</strong>. 
          Then, customize your testing kit based on your company&apos;s unique needs.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* Step 1: Company Details */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl"><Settings className="h-7 w-7 text-accent" />Tell Us About Your Company</CardTitle>
            <CardDescription>This information helps us recommend the most relevant sensors for your custom testing kit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="activities">Key Company Activities (e.g., manufacturing, logistics, agriculture)</Label>
              <Textarea id="activities" name="activities" value={companyDetails.activities} onChange={handleInputChange} placeholder="Describe your primary operations..." />
            </div>
            <div>
              <Label htmlFor="products">Main Products/Services</Label>
              <Textarea id="products" name="products" value={companyDetails.products} onChange={handleInputChange} placeholder="List your main offerings..." />
            </div>
            <div>
              <Label htmlFor="materials">Primary Materials Used in Production</Label>
              <Textarea id="materials" name="materials" value={companyDetails.materials} onChange={handleInputChange} placeholder="e.g., plastics, metals, chemicals, organic matter..." />
            </div>
            <div>
              <Label htmlFor="machinery">Key Machinery & Equipment</Label>
              <Textarea id="machinery" name="machinery" value={companyDetails.machinery} onChange={handleInputChange} placeholder="e.g., CNC machines, delivery fleet, HVAC systems..." />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCalculateKit} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              <RefreshCw className="mr-2 h-4 w-4" />
              {kitCalculated ? "Recalculate My Custom Kit" : "Calculate My Custom Kit & Price"}
            </Button>
          </CardFooter>
        </Card>

        {/* Step 1.5: Recommended Kit (appears after calculation) */}
        {kitCalculated && (
          <Card className="shadow-lg border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Package className="h-6 w-6 text-primary" />Your Recommended Custom Kit</CardTitle>
              <CardDescription>Based on your input, we suggest the following sensors. This kit is priced at <strong className="text-foreground">{customKitPrice} Dinar</strong> (one-time or per-shipment based on frequency).</CardDescription>
            </CardHeader>
            <CardContent>
              {customKitSensors.length > 0 ? (
                <ul className="space-y-3">
                  {customKitSensors.map(sensor => (
                    <li key={sensor.id} className="flex items-start gap-3 p-3 border rounded-md bg-muted/50">
                      <sensor.icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">{sensor.name} <span className="text-xs text-muted-foreground">({sensor.category})</span></h4>
                        <p className="text-sm text-muted-foreground">{sensor.description}</p>
                        <p className="text-xs font-medium text-primary/80">Price: {sensor.price} Dinar</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific sensors recommended based on current input. A default starter kit will be considered.</p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Step 2: Kit & Service Options */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl"><CalendarDays className="h-7 w-7 text-accent" />Customize Your Kit & Services</CardTitle>
            <CardDescription>Choose how often you&apos;d like to receive your testing kit and if you need expert assistance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="deliveryFrequency">Testing Kit Delivery Frequency</Label>
              <Select value={deliveryFrequency} onValueChange={setDeliveryFrequency}>
                <SelectTrigger id="deliveryFrequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly (Kit cost added to monthly bill)</SelectItem>
                  <SelectItem value="quarterly">Quarterly (One-time kit cost per quarter)</SelectItem>
                  <SelectItem value="bi-annually">Bi-Annually (One-time kit cost twice a year)</SelectItem>
                  <SelectItem value="one-time">One-Time Purchase (Kit cost paid once)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {deliveryFrequency === "monthly" 
                  ? `Your custom kit cost of ${customKitPrice} Dinar will be added to your monthly subscription.`
                  : `Your custom kit cost of ${customKitPrice} Dinar will be a one-time charge for this delivery cycle.`
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="expertHelp" checked={expertHelp} onCheckedChange={(checked) => setExpertHelp(checked as boolean)} />
              <Label htmlFor="expertHelp" className="flex flex-col">
                <span>Add On-Site Expert Testing Assistance</span>
                <span className="text-xs text-muted-foreground">(One-time fee of <strong className="text-foreground">{expertHelpPrice} Dinar</strong> per visit)</span>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Order Summary & Confirmation */}
        <Card className="shadow-xl border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl"><CheckCircle className="h-7 w-7 text-primary" />Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Access (Monthly):</span>
              <span className="font-semibold text-foreground">{platformFee} Dinar</span>
            </div>
            {kitCalculated && (
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Custom Testing Kit ({deliveryFrequency === "monthly" ? "Added to Monthly" : "One-Time for this Cycle"}):</span>
                    <span className="font-semibold text-foreground">{customKitPrice} Dinar</span>
                </div>
            )}
            {expertHelp && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expert Assistance (One-Time):</span>
                <span className="font-semibold text-foreground">{expertHelpPrice} Dinar</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-primary">Total Monthly Cost:</span>
              <span className="font-bold text-primary">{totalMonthlyCost} Dinar</span>
            </div>
            {totalOneTimeCost > 0 && deliveryFrequency !== "monthly" && (
                <div className="flex justify-between text-md">
                    <span className="text-muted-foreground">Additional One-Time Cost this Cycle:</span>
                    <span className="font-semibold text-foreground">{totalOneTimeCost} Dinar</span>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button onClick={handleConfirmPurchase} disabled={!kitCalculated || orderConfirmed} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
              {orderConfirmed ? <><Check className="mr-2 h-5 w-5" /> Order Confirmed!</> : "Confirm Purchase & Subscribe"}
            </Button>
            {orderConfirmed && deliveryDate && (
              <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700">
                <Truck className="h-5 w-5 text-green-600" />
                <AlertTitle className="font-semibold">Kit on its way!</AlertTitle>
                <AlertDescription>
                  Your testing kit is scheduled for delivery around: <strong className="text-green-800">{deliveryDate}</strong>.
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>

        {/* Step 4: Subscription Management (appears if order confirmed or for existing users) */}
        {(orderConfirmed || true) && ( /* Logic to show this for existing users would be needed */
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Settings className="h-6 w-6 text-muted-foreground" />Manage Subscription</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={handleCancelSubscription} className="w-full sm:w-auto">
                <XCircle className="mr-2 h-4 w-4" /> Cancel Platform Subscription
              </Button>
              <Button variant="outline" onClick={handleCancelKitOrder} className="w-full sm:w-auto">
                <Package className="mr-2 h-4 w-4" /> Manage/Cancel Kit Order(s)
              </Button>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">Changes to your subscription or kit orders may take effect from the next billing cycle.</p>
            </CardFooter>
          </Card>
        )}

        {/* Coming Soon Feature Teaser */}
        <Card className="shadow-xl bg-gradient-to-br from-secondary/30 to-background border-accent/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                    <Sparkles className="h-8 w-8" />
                    Coming Soon: Personalized Expert Guidance!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-base">
                    Elevate your sustainability journey! Soon, you&apos;ll be able to request a dedicated EcoPulse expert for a comprehensive on-site analysis. 
                    Our experts will help you:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1.5 text-muted-foreground pl-4">
                    <li>Conduct in-depth environmental assessments.</li>
                    <li>Develop a tailored, actionable sustainability plan for your company.</li>
                    <li>Identify high-impact areas for improvement and cost savings.</li>
                    <li>Set and track ambitious environmental goals.</li>
                </ul>
                <p className="mt-4 font-semibold text-accent-foreground">
                    Stay tuned for this premium service designed to help you achieve peak environmental performance!
                </p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" disabled className="border-accent text-accent hover:bg-accent/10">
                    <UserCheck className="mr-2 h-4 w-4"/> Learn More (Coming Soon)
                </Button>
            </CardFooter>
        </Card>

      </div>
    </div>
  );
}

