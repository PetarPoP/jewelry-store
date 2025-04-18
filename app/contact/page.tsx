'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sendContactEmail } from '@/app/actions/email';

export default function ContactPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        date: date ? format(date, 'dd.MM.yyyy', { locale: hr }) : undefined,
        time: time,
      };

      // Send email using the server action
      const result = await sendContactEmail(submissionData);

      if (result.success) {
        toast.success(result.message);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
        });
        setDate(undefined);
        setTime(undefined);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Došlo je do pogreške prilikom slanja poruke. Molimo pokušajte kasnije.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground h-screen snap-y snap-mandatory overflow-y-auto font-serif">
      <Toaster position="top-center" richColors />
      {/* Navigation */}
      <Navigation />

      {/* Contact Header - Full height with snap */}
      <section className="bg-primary/5 relative flex h-screen snap-start items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in text-center">
            <h1 className="text-foreground text-4xl font-light tracking-tight sm:text-5xl">
              <span className="block">Javite nam se</span>
              <span className="text-primary animate-slide-in animation-delay-200 mt-2 block font-medium">
                Rado ćemo Vam pomoći!
              </span>
            </h1>
            <p className="text-foreground/80 animate-fade-in animation-delay-300 mx-auto mt-6 max-w-xl text-lg">
              Imate li pitanja o našim kolekcijama ili ste zainteresirani za prilagođeni komad?
              Ispunite obrazac u nastavku i naš tim će vam se ubrzo javiti.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Google Map - with snap and scrollable content */}
      <section className="min-h-screen snap-start py-16 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="border-primary/10 animate-fade-in shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-primary text-2xl font-medium">
                  Kontaktirajte nas
                </CardTitle>
                <CardDescription>
                  Molim vas da ispunite ovaj obrazac, također odaberite datum i vrijeme ako želite
                  zakazati termin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-foreground text-sm font-medium">
                        Ime
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border-primary/20 bg-background focus:border-primary focus:ring-primary/50 w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-foreground text-sm font-medium">
                        Prezime
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="border-primary/20 bg-background focus:border-primary focus:ring-primary/50 w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-foreground text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="border-primary/20 bg-background focus:border-primary focus:ring-primary/50 w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-foreground text-sm font-medium">
                      Naslov
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="border-primary/20 bg-background focus:border-primary focus:ring-primary/50 w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
                    />
                  </div>

                  {/* Calendar and Time Selection */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-foreground text-sm font-medium">
                        Datum (opcionalno)
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, 'dd.MM.yyyy', { locale: hr })
                            ) : (
                              <span>Odaberite datum</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            locale={hr}
                            weekStartsOn={1}
                            disabled={(date) =>
                              date < new Date() ||
                              date > new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-foreground text-sm font-medium">
                        Vrijeme (opcionalno)
                      </label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Odaberite vrijeme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:00">9:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="12:00">12:00</SelectItem>
                          <SelectItem value="13:00">13:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-foreground text-sm font-medium">
                      Poruka
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="border-primary/20 bg-background focus:border-primary focus:ring-primary/50 w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Slanje...
                        </>
                      ) : (
                        'Pošalji poruku'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Google Map and Contact Info */}
            <Card className="border-primary/10 animate-fade-in animation-delay-100 flex flex-col shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-primary text-2xl font-medium">
                  Gdje nas pronaći
                </CardTitle>
                <CardDescription>
                  Posjetite nas na adresi ili nas kontaktirajte direktno.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col">
                {/* Contact Info Panel */}
                <div className="mb-6 flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">+387 63 330 632</p>
                      <p className="text-foreground/70 text-sm">Ponedjeljak-Petak, 9-14h</p>
                      <p className="text-foreground/70 text-sm">Subota, 9-13h</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">info@zlatarnapopovic.hr</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Kneza Mutimira 27</p>
                      <p className="text-foreground/70 text-sm">Livno, 80101, BiH</p>
                    </div>
                  </div>
                </div>

                {/* Google Map */}
                <div className="border-primary/10 h-96 flex-grow overflow-hidden rounded-lg border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2840.574121433844!2d17.0007201!3d43.825052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475f8d05bd62a2d5%3A0x7041834ba9b181d0!2sZlatara%20Popovi%C4%87!5e0!3m2!1shr!2shr!4v1712572824080!5m2!1shr!2shr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
