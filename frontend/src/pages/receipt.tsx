import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { useSearchParams } from "wouter";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode.react";
import PageHead from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Package, Download, Printer, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

interface ReceiptData {
  trackingToken: string;
  name: string;
  email: string;
  phone: string;
  device: string;
  issue: string;
  serviceType: string;
  country: string;
  createdAt: string;
}

export default function Receipt() {
  const [, setLocation] = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useI18n();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Get tracking token from URL
  const trackingToken = searchParams.token;

  if (!trackingToken) {
    return (
      <>
        <PageHead title="Receipt" description="Repair receipt" />
        <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Please go back to your booking confirmation to access the receipt.
          </p>
          <Button onClick={() => setLocation("/")} className="rounded-none">
            Go Home
          </Button>
        </div>
      </>
    );
  }

  // Parse receipt data from localStorage (set by booking page)
  const receiptData: ReceiptData = JSON.parse(
    localStorage.getItem(`receipt_${trackingToken}`) || '{}'
  );

  if (!receiptData.name) {
    return (
      <>
        <PageHead title="Receipt" description="Repair receipt" />
        <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Receipt Expired</h1>
          <p className="text-muted-foreground mb-6">
            This receipt data is no longer available. Please create a new booking.
          </p>
          <Button onClick={() => setLocation("/booking")} className="rounded-none">
            New Booking
          </Button>
        </div>
      </>
    );
  }

  // Download as PDF
  const downloadPDF = async () => {
    if (!receiptRef.current) return;
    setLoading(true);

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`EMMI-Receipt-${trackingToken}.pdf`);

      toast({
        title: "Success",
        description: "Receipt downloaded as PDF",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download PDF",
      });
    } finally {
      setLoading(false);
    }
  };

  // Print
  const handlePrint = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(receiptRef.current.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const deviceTranslations: Record<string, string> = {
    phone: "Smartphone",
    computer: "Computer",
    tablet: "Tablet",
    coffee_machine: "Coffee Machine",
    washing_machine: "Washing Machine",
  };

  const serviceTypeTranslations: Record<string, string> = {
    mail: "Mail Service",
    home: "Home Service",
  };

  return (
    <>
      <PageHead
        title="Repair Receipt"
        description="Your repair service receipt"
        canonical="/receipt"
      />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Controls */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="rounded-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            className="rounded-none"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={downloadPDF}
            disabled={loading}
            className="rounded-none flex-1 sm:flex-none"
          >
            <Download className="w-4 h-4 mr-2" />
            {loading ? "Downloading..." : "Download PDF"}
          </Button>
        </div>

        {/* Receipt */}
        <div
          ref={receiptRef}
          className="bg-white border-2 border-black p-8 shadow-lg"
          style={{ pageBreakAfter: "avoid" }}
        >
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-serif font-bold">EMMI Europe</h1>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Electronics, Machines & Mobile Instruments
            </p>
            <p className="text-xs text-gray-500">
              Professional Repair Services
            </p>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-black pb-3 mb-4">
              REPAIR SERVICE RECEIPT
            </h2>
            <p className="text-sm text-gray-600">
              Please keep this receipt for reference
            </p>
          </div>

          {/* Tracking Info */}
          <div className="bg-gray-100 border-2 border-black p-4 mb-8">
            <p className="text-xs text-gray-600 mb-1">TRACKING CODE</p>
            <p className="text-2xl font-mono font-bold break-all">
              {trackingToken}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* QR Code */}
            <div className="flex flex-col items-center border-r-2 border-black pr-4">
              <p className="text-xs font-bold mb-2 uppercase">Scan for Tracking</p>
              <QRCode
                value={`${window.location.origin}/track?token=${trackingToken}`}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Customer Info */}
            <div className="pl-4">
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-600 mb-1">CUSTOMER</p>
                <p className="font-bold text-sm">{receiptData.name}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-gray-600 mb-1">EMAIL</p>
                <p className="text-sm">{receiptData.email}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-gray-600 mb-1">PHONE</p>
                <p className="text-sm">{receiptData.phone}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 mb-1">COUNTRY</p>
                <p className="text-sm">{receiptData.country}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="border-t-2 border-b-2 border-black py-6 mb-8">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2">DEVICE</p>
                <p className="text-sm font-bold">
                  {deviceTranslations[receiptData.device] || receiptData.device}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2">SERVICE</p>
                <p className="text-sm font-bold">
                  {serviceTypeTranslations[receiptData.serviceType] ||
                    receiptData.serviceType}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-600 mb-2">ISSUE DESCRIPTION</p>
              <p className="text-sm border-l-4 border-gray-400 pl-3 italic">
                "{receiptData.issue}"
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="text-center mb-8">
            <p className="text-xs text-gray-600 mb-1">DATE SUBMITTED</p>
            <p className="text-sm font-bold">
              {new Date(receiptData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border-2 border-yellow-600 p-4 mb-8">
            <p className="text-xs font-bold mb-2">📋 INSTRUCTIONS</p>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>• Attach this receipt to your device when sending</li>
              <li>• Keep this code for tracking your repair status</li>
              <li>• Visit emmi-eu.com/track to check progress</li>
              <li>• Scan the QR code from your smartphone</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black pt-6 text-center">
            <p className="text-xs text-gray-600 mb-2">
              Thank you for choosing EMMI Europe
            </p>
            <p className="text-xs font-bold">
              www.emmi-eu.com | Contact: support@emmi-eu.com
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Your repair status will be updated regularly
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold text-blue-900 mb-2">📌 Quick Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Print or save this receipt</li>
            <li>✓ Attach it to your device/package</li>
            <li>✓ Or take a photo and keep it on your phone</li>
            <li>✓ Use the tracking code to check status anytime</li>
          </ul>
        </div>
      </div>
    </>
  );
}
