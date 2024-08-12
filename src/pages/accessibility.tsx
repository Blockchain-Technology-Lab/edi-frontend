import { Card } from "@/components"

export default function AccessibilityPage() {
  return (
    <section className="flex flex-col gap-12">
      <Card title="Accessibility Statement" titleAs="h1" titleAppearance="xl">
        <p>
          This website is run by the School of Informatics and is committed to
          ensuring accessibility of its digital products and services to all
          users, including those with disabilities. We strive to adhere to the
          Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level to
          provide an inclusive and accessible experience for all visitors.
        </p>
        <ul>
          <li>
            <b>Keyboard Navigation</b>: Most of our website can be navigated
            using standard keyboard commands.
          </li>
          <li>
            <b>Alt Text for Images</b>: The images on our website are
            accompanied by descriptive alternative text.
          </li>
          <li>
            <b>Color Contrast</b>: We maintain sufficient color contrast
            throughout our website to ensure readability for users with low
            vision or color blindness.
          </li>
          <li>
            <b>Resizable Text</b>: Users can adjust text size and font styles
            using browser settings, allowing for greater readability and
            customization.
          </li>
        </ul>
        <h2>
          <b>
            <u>Feedback</u>
          </b>
        </h2>
        <p>
          We welcome feedback on the accessibility of our website. If you
          encounter any accessibility barriers or have suggestions for
          improvement, please contact us at edi@ed.ac.uk. We are committed to
          addressing and resolving accessibility issues promptly.
        </p>
        <h2>
          <b>
            <u>Accessibility Compliance</u>
          </b>
        </h2>
        <p>
          Our team regularly evaluates our website to ensure compliance with
          accessibility standards. While we strive to adhere to WCAG guidelines,
          we recognise that achieving full accessibility may be an ongoing
          process. We are dedicated to continually improving the accessibility
          of our digital products and services.
        </p>
        <h2>
          <b>
            <u>Accessibility Statement Updates</u>
          </b>
        </h2>
        <p>
          This Accessibility Statement will be reviewed and updated regularly to
          reflect any changes in accessibility features or standards. The last
          update to this statement was on March 22, 2024.
        </p>
        <h2>
          <b>
            <u>Contact Us</u>
          </b>
        </h2>
        <p>
          If you have any questions or concerns about the accessibility of our
          website, please contact us at edi@ed.ac.uk.
        </p>
      </Card>
    </section>
  )
}
