import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    // Replace with your business WhatsApp number
    const phoneNumber = "1234567890"; // Example number
    const message = "Hi! I need help with my social media post scheduling.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        size="lg"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="sr-only">Contact us on WhatsApp</span>
      </Button>
    </div>
  );
};

export default WhatsAppButton;