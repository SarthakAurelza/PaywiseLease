import React from 'react'

const Info = () => {
  const sections = [
    {
      title: 'How to Use the Novated Lease Calculator',
      paragraph: 'Our novated lease calculator gives you an estimate of your potential costs and savings based on several key factors, including your salary, lease term, and vehicle choice. To get started, tell us a little about yourself, so we can model our quote on the unique way you like to drive.',
      listItems: [
        "Select Your Preferred Type of Vehicle: If you want to get the most bang for your buck, considering going electric! EV's are exempt from fringe benefit tax, making them the most cost-effective option out there. However, petrol and hybrid vehicles also offer a great choice and strong savings compared to a standard leasing arrangement.",
        "Enter Your Expected Yearly KM's: We’ll calculate your estimated running costs including fuel/charging, insurance, registration, new tyres, and servicing based on how much you drive each year. If you are someone who drives less than the average person, expect to save even more on your new vehicle!",
        'Choose Your Lease Term Option: With flexible options ranging from one to five years, you can tailor your novated lease to suit your needs. A longer lease term typically results in lower weekly payments, as the cost of the vehicle is spread over a greater period.',
        "Enter Your Salary: Next, you'll enter your salary to help us determine how much pre-tax income can be applied to your novated lease. Generally, the higher your tax bracket, the greater your savings. However, there are significant tax savings to be made no matter your income level.",
        "Select Your State: Finally, enter your home state, as this can affect your results due to differences in stamp duty, car registration fees, road taxes, payroll tax, and applicable EV incentives"
      ]
    },
    {
      title: 'Understanding Your Novated Lease Calculator Results',
      paragraph: 'Once you’ve entered your details and selected your vehicle, the calculator will provide all the key information you need to make an informed decision about your novated lease. You can also compare up to four vehicles at a time using our compare feature to help you find the best option for your needs. Here’s how to interpret your results.',
      listItems: [
        'Inclusions: The calculator provides a detailed breakdown of all running costs included in your regular payment. These typically cover financing, insurance, maintenance, registration, new tyres, and of course fuel and/or charging.',
        'GST Savings: This section highlights how much GST you can save on your vehicle’s purchase price by financing it through a novated lease with Paywise.',
        "Income Tax Savings: Next, you'll see an estimate of your annual income tax savings by covering a portion of your running costs and the vehicle financing using your pre-tax dollars.",
        "Total Savings: This figure represents your combined GST and income tax savings over the duration of your novated lease with Paywise.",
        "Your Lease Cost: This is your regular repayment amount which can be structured on a weekly, fortnightly, or monthly basis. Your employer will deduct this amount from your take-home pay in line with your pay cycle."
      ]
    },
    {
      title: 'Why Choose Paywise for Your Novated Lease?',
      paragraph: "With over 35 years of experience, Paywise has helped thousands of Australians get behind the wheel of their new or used vehicle using pre-tax dollars. Our novated leasing options offer a convenient way to cover the purchase and running costs of your vehicle. We negotiate competitive pricing and help you save on the GST of the purchase price and running costs - that's fuel/charging, servicing, insurance, registration, new tyres and more.Backed by an industry-leading four-hour response time guarantee, we make novated leasing simple and stress-free. Plus with affordable options for eligible employees across Australia, you could be driving away in a new car and saving sooner than you think!Make the wise choice and start your journey with Paywise today!'" ,
      listItems: [
        'Inclusions: The calculator provides a detailed breakdown of all running costs included in your regular payment. These typically cover financing, insurance, maintenance, registration, new tyres, and of course fuel and/or charging.',
        'GST Savings: This section highlights how much GST you can save on your vehicle’s purchase price by financing it through a novated lease with Paywise.',
        "Income Tax Savings: Next, you'll see an estimate of your annual income tax savings by covering a portion of your running costs and the vehicle financing using your pre-tax dollars.",
        "Total Savings: This figure represents your combined GST and income tax savings over the duration of your novated lease with Paywise.",
        "Your Lease Cost: This is your regular repayment amount which can be structured on a weekly, fortnightly, or monthly basis. Your employer will deduct this amount from your take-home pay in line with your pay cycle."
      ]
    }
  ];

  return (
    <div className='flex flex-col w-full gap-16 3xl:gap-36 lg:p-16 3xl:py-24 md:p-8 sm:p-6 p-4'>
      {sections.map((section, index) => (
        <div key={index} className='flex flex-col md:w-[90%] lg:w-[65%] 3xl:w-[75%] gap-10'>
          <h2 className='font-semibold text-primary text-[19px] xs:text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl xxl:text-7xl 3xl:text-8xl leading-16'>
            {section.title}
          </h2>
          <p className='text-muted 3xl:text-3xl xxl:text-2xl 2xl:text-xl xl:text-lg sm:text-md xs:text-sm text-sm'>
            {section.paragraph}
          </p>
          <ul className='text-muted flex flex-col gap-4 list-disc pl-4 xxl:text-2xl 2xl:text-xl xl:text-lg sm:text-md xs:text-sm text-sm 3xl:text-3xl'>
            {section.listItems.map((item, i) => {
              const [boldPart, restOfTheText] = item.split(':'); // Split the string at the colon
              return (
                <li key={i}>
                  <strong>{boldPart}:</strong> {restOfTheText}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Info;


