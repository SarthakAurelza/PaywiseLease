import { motion } from "framer-motion";

const QuoteForm = ({ handleSubmit }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col h-full justify-between items-start w-full"
  >
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full h-full">
      <input type="text" name="first_name" className="border p-2 rounded-md w-full border-primary" placeholder="First Name*" required />
      <input type="text" name="last_name" className="border p-2 rounded-md w-full border-primary" placeholder="Last Name*" required />
      <input type="email" name="email" className="border p-2 rounded-md w-full border-primary" placeholder="Enter your email" required />
      <input type="tel" name="phone" className="border p-2 rounded-md w-full border-primary" placeholder="Enter your phone number" required />
      <textarea name="comment" className="border p-2 rounded-md w-full h-60 border-primary" placeholder="Any additional requests"></textarea>
      <button type="submit" className="bg-muted text-white p-3 rounded-md text-lg font-semibold mt-4">Submit Quote Request</button>
    </form>
    <p className="mt-6">By clicking "submit", you acknowledge our Privacy Policy which contains a description of how we use your personal information.</p>
  </motion.div>
);

export default QuoteForm;
