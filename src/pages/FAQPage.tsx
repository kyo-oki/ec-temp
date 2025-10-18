import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

export function FAQPage() {
  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, PayPal, and bank transfers.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 day delivery.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all unused items in their original packaging. Contact our customer service team to initiate a return.',
    },
    {
      question: 'Do you offer bulk discounts for teams or schools?',
      answer: 'Yes! We offer special pricing for bulk orders. Please contact us with your requirements for a custom quote.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can use this to track your package on our website or the carrier\'s website.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we ship within the country only. International shipping may be available for select items - please contact us for more information.',
    },
    {
      question: 'How do I care for my sports equipment?',
      answer: 'Check out our Blog & Resources section for detailed care guides for different types of equipment.',
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify your order within 24 hours of placing it. After that, the order may have already been processed for shipping.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4">Frequently Asked Questions</h1>
          <p className="text-lg opacity-90">
            Find answers to common questions about our products and services
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
