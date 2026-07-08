'use client';
import { PlusIcon, MinusIcon } from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQs = () => {
  const faq = [
    {
      question: 'What payment method do you accept?',
      answer:
        'We accept all major credit cards, PayPal, and various other payment methods. Ask our team for more information on accepted payment methods in your region.',
    },
    {
      question: 'How does the pricing work for bundles?',
      answer:
        'Our pricing is per transaction, you can buy more than one tickets but must in the same time and place. Discount are available for larger teams',
    },
    {
      question: 'Can I change my plan later?',
      answer:
        'Yes, you can change your plan anytime but no money refund. Changes to your plan will be prorated and reflected in your next billing cycle.',
    },
    {
      question: 'Is my data secure enough?',
      answer:
        'Security is our top priority, We use state-of-the-art encryption and comply with the best industry practices to ensure that your data stored securely and accessed only by authorized users',
    },
    {
      question: 'Can I sell more than 1 tickets at once?',
      answer: 'Yes, you can sell more than 1 tickets at once.',
    },
  ];

  const Accordionitem = (
    { question, answer }: { question: string; answer: string },
    index: string,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div
        key={index}
        className="py-7 border-b border-white/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-center">
          <span className="flex-1 text-lg font-bold">{question}</span>
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                marginTop: 0
              }}
              animate={{
                opacity: 1,
                height: 'auto',
                marginTop: '16px'
              }}
              exit={{
                opacity: 0,
                height: 0,
                marginTop: 0
              }}
            >
              {answer}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  return (
    <>
      <div className="bg-black text-white bg-gradient-to-b from-[#5D2CA8] to-black py-[72px] w-full justify-center items-center flex">
        <div className="container">
          <h2 className="text-center font-bold text-3xl md:text-5xl tracking-tighter hover:drop-shadow-[0_0_0.3rem_#ffffff]">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 cursor-pointer max-w-[800px] mx-auto">
            {faq.map(({ question, answer }, index) => (
              <Accordionitem question={question} answer={answer} key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
