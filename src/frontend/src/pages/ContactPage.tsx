import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src="/assets/generated/ezyride-logo-transparent.dim_200x200.png" 
                alt="Ezyride Logo" 
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              Contact MBEvHub
            </h1>
            <p className="text-xl text-muted-foreground">
              Visit our showroom or get in touch with us. We're here to help!
            </p>
          </div>

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-electric-blue/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center mb-2">
                  <MapPin className="w-6 h-6 text-electric-blue" />
                </div>
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  MBEVHub, Divya Vihar, Tunwala Road, Opposite UCO Bank, Miyawala, Dehradun, Uttarakhand
                </p>
              </CardContent>
            </Card>

            <Card className="border-electric-green/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-electric-green/10 flex items-center justify-center mb-2">
                  <Phone className="w-6 h-6 text-electric-green" />
                </div>
                <CardTitle>Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Mobile: <a href="tel:7005626159" className="text-foreground hover:text-electric-green transition-colors">7005626159</a>
                </p>
                <p className="text-sm text-muted-foreground">
                  Available 24/7 for support
                </p>
              </CardContent>
            </Card>

            <Card className="border-electric-purple/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-electric-purple/10 flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-electric-purple" />
                </div>
                <CardTitle>Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <a href="mailto:manrales12@gmail.com" className="text-foreground hover:text-electric-purple transition-colors">
                    manrales12@gmail.com
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll respond within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-electric-blue" />
                Find Us on the Map
              </CardTitle>
              <CardDescription>
                MBEVHub Showroom Location - Dehradun, Uttarakhand
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[400px] md:h-[500px] rounded-b-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.8!2d78.0!3d30.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDE4JzAwLjAiTiA3OMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin&q=MBEVHub,+Divya+Vihar,+Tunwala+Road,+Opposite+UCO+Bank,+Miyawala,+Dehradun,+Uttarakhand"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MBEvHub Location"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Have a question? Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
